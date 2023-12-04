const SOF_CODE							= 0x01;
const NACK_CODE							= 0x15;
const CAN_CODE							= 0x18;
const ACK_CODE							= 0x06;
const REQUEST_CODE						= 0x00;
const RESPONSE_CODE						= 0x01;

const SUCCESS_CODE						= 0x31;
const FAIL_CODE							= 0x30;

const WRITECYCLE_OK_CODE				= 0x0D;

const RECV_OK 							= 0x00;
const RECV_NOACK						= 0x01;
const RECV_INVALIDDATALEN				= 0x02;
const RECV_INVALIDCRC					= 0x03;
const RECV_WRONGDATA					= 0x04;
const RECV_NOSOF						= 0x05;

const rcv_sof_timeout					= 3500;
const send_quant_size					= 240;

const ADDITIONAL_SIZE					= 3;

const ZUNO_HEADER_PREAMBL				= "ZMEZUNOC";

const SK_START_OFFSET_OLD				= 0x30000;
const SK_START_OFFSET					= 0x34800;
const SK_HEADER_SIZE					= 0xC0;
const SK_HEADER_VERSION_MSB_OFFSET		= 0x08;
const SK_HEADER_VERSION_LSB_OFFSET		= 0x09;
const SK_HEADER_SIZE_MSB_OFFSET			= 0x0A;
const SK_HEADER_CRC_MSB_OFFSET			= 0x0C;
const SK_HEADER_CRC_CALC_START			= 0xC0;
const SK_HEADER_NAME_START				= 56;
const SK_HEADER_MAX_NAME				= 47;
const SK_HEADER_HWREW_OFFSET			= SK_HEADER_NAME_START + SK_HEADER_MAX_NAME + 1;

const FREQ_TABLE_U7 = {"EU":0x00, "US":0x01, "ANZ":0x02, "HK": 0x03, "MY": 0x04, "IN":0x05,"IL": 0x06,
  "RU": 0x07, "CN": 0x08, "US_LR":0x09, "US_LR_BK":0x0A, "JP": 0x20, "KR":0x21, "FK":0xFE };

var g_queue;
var g_seqNo;
var g_fd = null;

const CRC_POLY							= 0x1021;

function calcSigmaCRC16(crc, data, offset, llen) {
  let new_bit, wrk_data, b, a, bit_mask;
  let bin_data = data;
  while (llen != 0) {
    llen -= 1;
    if (offset >= bin_data.length)
      wrk_data = 0xFF;
    else
      wrk_data = bin_data[offset];
    offset += 1;
    bit_mask = 0x80;
    while (bit_mask != 0) {
      a = 0;
      b = 0;
      if ((wrk_data & bit_mask) != 0)
        a = 1;
      if ((crc & 0x8000) != 0)
        b = 1;
      new_bit = a ^ b;
      crc <<= 1;
      crc = crc & 0xffff;
      if (new_bit == 1){
        crc ^= CRC_POLY;
      }
      bit_mask >>= 1;
    }
  }
  return (crc);
}

function Checksum(data) {
  let ret = 0xff;
  let i = 0x0;
  while (i < data.length) {
    ret = ret ^ data[i];
    i++;
  }
  return (ret);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsArrayBuffer(file);

  reader.onload = function() {
    g_fd = reader;
    console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

async function write(port, data) {
  // console.debug(">>", data);
  const data_uint8 = new Uint8Array(data);
  const writer = port.writable.getWriter();
  await writer.write(data_uint8);
  writer.releaseLock();
}

async function sendNack(port) {
  await write(port, [NACK_CODE])
}

async function sendAck(port) {
  await write(port, [ACK_CODE])
}

async function readWithTimeout(port, timeout) {
  let out;
  const reader = port.readable.getReader();
  const timer = setTimeout(() => {
    reader.releaseLock();
  }, timeout);
  try {
    const { value, done } = await reader.read();
    out = value;
  } catch (err) {
    out = [];
  }
  // console.debug("<<", out);
  clearTimeout(timer);
  reader.releaseLock();
  return (out);
}

async function read(port, num) {
  let out, i, rep;
  rep = 0x0;
  while (rep < 10) {
    if (g_queue.length >= num) {
      out = [];
      i = 0x0;
      while (i < num) {
        out.push(g_queue.shift())
        i++;
      }
      return (out);
    }
    const value = await readWithTimeout(port, 100);
    i = 0x0;
    while (i < value.length) {
      g_queue.push(value[i])
      i++;
    }
    rep++;
  }
  if (num >= g_queue.length)
    num = g_queue.length;
  out = [];
  i = 0x0;
  while (i < num) {
    out.push(g_queue.shift())
    i++;
  }
  return (out);
}

async function clear(port) {
  while (true) {
    const value = await readWithTimeout(port, 100);
    if (value.length == 0x0)
      return ;
  }
}

async function waitSOF(port) {
  const sof_timeout = Date.now() + rcv_sof_timeout;
  while (sof_timeout > Date.now()) {
    const sof = await read(port, 0x1);
    if (sof.length == 0x0) {
      await sleep(100);
      continue ;
    }
    if (sof[0x0] == SOF_CODE)
      return (true);
    await sleep(200);
  }
  return (false);
}

async function recvIncomingRequest(port) {
  let len_data, buff_data, test_buff, check_sum, check_buff;

  if (await waitSOF(port) == false)
    return ([RECV_NOSOF]);
  len_data = await read(port, 0x1);
  if (len_data.length == 0x0)
    return ([RECV_NOSOF]);
  len_data = len_data[0x0];
  buff_data = await read(port, len_data);
  test_buff = [SOF_CODE, len_data];
  test_buff = test_buff.concat(buff_data);
  if (buff_data.length != len_data) {
    await sendNack(port);
    return ([RECV_INVALIDDATALEN]);
  }
  check_buff = [len_data].concat(buff_data.slice(0, len_data - 0x1))
  check_sum = Checksum(check_buff);
  if (check_sum != buff_data[len_data - 1]) {
    await sendNack(port);
    return ([RECV_INVALIDCRC]);
  }
  await sendAck(port);
  return ([RECV_OK].concat(check_buff));
}

async function resyncZunoPort(port) {
  if (navigator.platform = "Win32")
    await sleep(500);
  let data = await recvIncomingRequest(port);
  if (data[0x0] != RECV_OK)
    return (false);
  return (true);
}

async function sendData(port, cmd, databuff, have_callback = false) {
  let crc_data, final_data, crc16;
  let data_len = databuff.length + ADDITIONAL_SIZE;
  if (have_callback == true)
    data_len++;
  if (data_len > 255) {
    crc_data = [0x00, REQUEST_CODE, cmd].concat(databuff);
    final_data = [0x00, (data_len >> 8)& 0x0FF, data_len & 0x0FF, REQUEST_CODE, cmd].concat(databuff);
    if (have_callback == true)
      final_data = final_data.concat([g_seqNo]);
    crc16 = calcSigmaCRC16(0x1D0F, crc_data, 0, crc_data.length);
    final_data = [SOF_CODE].concat(final_data).concat([(crc16 >> 8) & 0xFF, (crc16) & 0xFF]);
    await write(port, final_data);
    g_seqNo += 1;
    g_seqNo &= 0XFF;// 1 byte
    return ;
  }
  final_data = [data_len & 0x0FF, REQUEST_CODE, cmd].concat(databuff);
  if (have_callback == true)
    final_data = final_data.concat([g_seqNo]);
  crc = Checksum(final_data);
  final_data = [SOF_CODE].concat(final_data).concat([crc]);
  await write(port, final_data);
  g_seqNo += 1;
  g_seqNo &= 0XFF;// 1 byte
}

async function sendCommandUnSz(port, cmd, databuff, have_callback = false, retries = 0x3) {
  let rbuff, result;
  // Вдруг что висит левое и не ожиданное в буфере
  await clear(port);
  while (true) {
    await sendData(port, cmd, databuff, have_callback);
    rbuff = await read(port, 0x1)
    if (rbuff.length == 0x0)
      return ([RECV_NOACK]);
    if (rbuff[0] == ACK_CODE)
      break ;
    if (rbuff[0] == CAN_CODE) {
      console.warn("!!!CANCODE")
      await recvIncomingRequest(port);
      retries -= 1;
      if (retries > 0)
        continue ;
    }
    if (rbuff[0] == NACK_CODE) {
      console.debug("!!!NACK")
      retries -= 1;
      if (retries > 0)
        continue ;
    }
    return ([RECV_NOACK]);
  }
  result = await recvIncomingRequest(port);
  return (result);
}

async function readNVM(port, addr, size) {
  return (await sendCommandUnSz(port, 0x2A, [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF], false));
}

async function writeNVM(port, addr, buff) {
  const size = buff.length;
  const data_addr = [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF];
  return (await sendCommandUnSz(port, 0x2B, data_addr.concat(buff), false));
}

async function checkBootImage(port) {
  return (sendCommandUnSz(port, 0x08, [0x04], false));
}

async function pushSketch(port, addr, size, crc16) {
  return sendCommandUnSz(port, 0x08, [0x01, (addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF, (crc16 >> 8) & 0xFF, (crc16) & 0xFF], false);
}

function zmeRemapDictVal2Key(d, val) {
  for (let k in d) {
    if (d[k] == val)
      return (k);
  }
  return (null);
}

function zme_costruct_int(arr, n, inv = true) {
  let val, i, indx;
  val =0;
  i = 0x0;
  while (i < arr.length) {
    val <<= 8;
    indx = i;
    if (inv == true)
      indx = n-1-i
    if ((indx < arr.length) && (indx >= 0))
      val += arr[indx];
    i++;
  }
  return (val);
}

async function readBoardInfo(port, bSketchMD = false, bKeys = true) {
  let md, bLR, info, param_info, r, bts, code_sz_shift, shift_smrt;
  md = {};
  info = await readNVM(port, 0xFFFF00, 0x01);
  if (info.length < 10)
    return (md);
  param_info = await readNVM(port, 0xFFE000, 0x09);
  if (param_info.length < 10)
    return (md);
  bLR = false;
  param_info = param_info.slice(4, param_info.length);
  r = zmeRemapDictVal2Key(FREQ_TABLE_U7, param_info[1])
  if (r != null)
    if ((r == "US_LR") || (r == "US") ||  (r == "US_LR_BK"))
      bLR = true;
  bts = info.slice(4, info.length);
  md["version"] = (bts[0] << 8) | (bts[1]);
  md["build_number"] = (bts[2] << 24) | (bts[3] << 16) |  (bts[4] << 8) | (bts[5]);
  md["build_ts"] = (bts[6] << 24) | (bts[7] << 16) |  (bts[8] << 8) | (bts[9]);
  md["hw_rev"] =  (bts[10] << 8) | (bts[11]);
  code_sz_shift = 0;
  if( md["build_number"] > 1116) {
    code_sz_shift = 1;
    md["code_size"] = zme_costruct_int(bts.slice(12,12+3), 3, false);
  }
  else
    md["code_size"] =  (bts[12] << 8) | (bts[13]);
  md["ram_size"] =  (bts[14+code_sz_shift] << 8) | (bts[15+code_sz_shift]);
  md["chip_uid"] =  bts.slice(16+code_sz_shift,16+code_sz_shift+8);
  // md["chip_uuid"] = bts.slice(16+code_sz_shift,16+code_sz_shift+8);
  md["s2_pub"] =  bts.slice(24+code_sz_shift,24+code_sz_shift+16);
  md["dbg_lock"] =  0xFF;
  md["home_id"] = 0;
  md["node_id"] = 0
  md["smart_qr"] = "";
  md["custom_code_offset"] = null;
  // #print("BTS_LEN:%d"%(len(bts)))
  if (bts.length > (44+code_sz_shift)) {
    md["dbg_lock"] = bts[40+code_sz_shift];
    md["home_id"] = zme_costruct_int(bts.slice(41+code_sz_shift,41+code_sz_shift+4), 4, false);
    md["node_id"] = bts[45+code_sz_shift];
  }
  shift_smrt = 11;
  if (bts.length > (46+shift_smrt+code_sz_shift+4)) {
    md["custom_code_offset"] = zme_costruct_int(bts.slice(46+code_sz_shift+shift_smrt,46+code_sz_shift+shift_smrt+4), 4, false)
    boot_addr = 0x3a000
    if(md["custom_code_offset"] > 0x36000)
      boot_addr = 0x40000;
    md["boot_offset"] = boot_addr;
  }
  md["param_info"] = param_info;
  return (md);
}

async function freezeSketch(port, retries = 50) {
  let sleep_time;
  sleep_time = 10;
  if (navigator.platform = "Win32")
    sleep_time = 50;
  while (retries != 0x0) {
    rcv = await sendCommandUnSz(port, 0x08, [0x02], false);
    if (rcv.length > 4) {
      if ((rcv[0] == RECV_OK) && (rcv[3] == 0x08) && (rcv[4] == 0x00))
        return (true);
    }
    await sleep(sleep_time);
    retries -= 1;
  }
  return (false);
}

async function syncWithDevice(port) {
  if (await resyncZunoPort(port) == false) {
    console.error("Не удалось синхронизироваться с зуной");
    return (false);
  }
  if (await freezeSketch(port) == false) {
    console.error("Не удалось синхронизироваться с зуной");
    return (false);
  }
  console.log("Синхронизировались с зуной");
  return (true);
}

function HeaderCmp(header, core_version, hw_rev = -1) {
  let header_version, header_hw_rev;
  const data_uint8 = new Uint8Array(header.slice(0, ZUNO_HEADER_PREAMBL.length));
  const string = new TextDecoder().decode(data_uint8);
  if (ZUNO_HEADER_PREAMBL != string)
    return (false);
  header_version = (header[SK_HEADER_VERSION_MSB_OFFSET] << 8) | header[SK_HEADER_VERSION_LSB_OFFSET];
  if (header_version != core_version)
    return (false);
  if(hw_rev != -1)
    header_hw_rev = zme_costruct_int(header.slice(SK_HEADER_HWREW_OFFSET, SK_HEADER_HWREW_OFFSET + 0x2), 2);
  if(hw_rev != header_hw_rev)
    return (false);
  return (true);
}

async function writeArrayToNVM(port, md, nvmaddr, array, data_offset=0) {
  let ret_data, data_quant, offset, data_remains, data_writed, len_send, buff, res;

  ret_data = array;
  offset = data_offset;
  data_remains = ret_data.length - data_offset;
  data_quant = 240;
  if (md["build_number"] >= 3396)
    data_quant = 2048;
  data_writed = 0;
  while (data_remains != 0x0) {
    console.log("Writing NVM data", (data_writed * 100.0) / (ret_data.length));
    len_send = data_quant;
    if (data_remains < data_quant)
      len_send = data_remains;
    buff = new Array();
    buff = buff.concat(ret_data.slice(offset,offset + len_send));
    if (buff.length == 1)
      buff = buff.concat([0xFF]);
    res = await writeNVM(port, nvmaddr, buff);
    if (res[0] != RECV_OK || res[4] != 1)
      return (null);
    offset += len_send;
    data_remains -= len_send;
    data_writed += len_send;
    nvmaddr += len_send;
  }
  console.log("Writing NVM data", "OK");
  return (ret_data);
}

async function applyPrams(port, md, freq, sec, main_pow) {
  let bts, min_len, res;

  bts = md["param_info"];
  min_len = 8;
  while (bts.byteLength < min_len)
    bts.push(0x0);
  bts[1] = freq;
  if (bts.byteLength > 8)
    bts[8] = freq;
  bts[4] = sec;
  bts[2] = main_pow;
  res = await writeNVM(port, 0xFFE000, bts);
  if (res[0] != RECV_OK || res[4] != 1) {
    console.error("Не удалось применить параметры");
    return (false);
  }
  console.error("Параметры успешно применены!!!");
  return (true);
}

async function waitFinware(port) {
  let result;
  const sof_timeout = Date.now() + 30000;
  while (sof_timeout > Date.now()) {
    result = await recvIncomingRequest(port);
    if (result[0] == RECV_OK) {
      if (result.length < 6)
        return (false);
      if (result[3] != 0x08)
        return (false);
      if (result[5] != 0x01)
        return (false);
      return (true);
    }
    await sleep(100);
  }
  return (false);
}

async function loadFinware() {
  let res, result;
  g_queue = []
  g_seqNo = 0x0;
  if (g_fd == null) {
    console.error("Не удалось открыть файл");
    return ;
  }
  const filters = [{ usbVendorId: 0x10c4, usbProductId: 0xea60 }];
  const port = await navigator.serial.requestPort({filters});
  await port.open({ baudRate: 230400, bufferSize: 4096 });
  console.log("Open");
  if (await syncWithDevice(port) == false) {
    console.error("Не удалось синхронизироваться");
    return ;
  }
  md = await readBoardInfo(port);
  if (Object.keys(md).length == 0x0) {
    console.error("Не удалось прочитать board info");
    return ;
  }
  result = new Uint8Array(g_fd.result);
  result = [].slice.call(result);
  sk_data = await writeArrayToNVM(port, md, 0x3A000, result);
  if (sk_data == null) {
    console.error("Не удалось залить прошивку");
    return ;
  }
  res = await checkBootImage(port);
  if (await waitFinware(port) == false) {
    console.error("Что то не то - прошивку не удалось обновить - может проблемма с версией");
    return ;
  }
  await waitFinware(port);
  console.info("Успешно обновилось!!!");
  port.close();
}

async function loadSketch() {
  let sketch_start_addr, header, result, crc16, res, sk_data, md;
  g_queue = []
  g_seqNo = 0x0;
  if (g_fd == null) {
    console.error("Не удалось открыть файл");
    return ;
  }
  const filters = [{ usbVendorId: 0x10c4, usbProductId: 0xea60 }];
  const port = await navigator.serial.requestPort({filters});
  await port.open({ baudRate: 230400, bufferSize: 4096 });
  console.log("Open");
  if (await syncWithDevice(port) == false) {
    console.error("Не удалось синхронизироваться");
    return ;
  }
  md = await readBoardInfo(port);
  if (Object.keys(md).length == 0x0) {
    console.error("Не удалось прочитать board info");
    return ;
  }
  sketch_start_addr = SK_START_OFFSET_OLD;
  if (("custom_code_offset" in md) && (md["custom_code_offset"] != null))
    sketch_start_addr = md["custom_code_offset"];
  result = new Uint8Array(g_fd.result);
  result = [].slice.call(result)
  header = result.slice(0, SK_HEADER_SIZE);
  if (HeaderCmp(header, md["version"], md["hw_rev"]) == false) {
    console.error("Не  совпадает версия");
    return ;
  }
  if (result.length > md["code_size"]) {
    console.error("Слишком большой размер скетча");
    return ;
  }
  if (await applyPrams(port, md, 0, 0, 33) == false)
    return ;
  console.log("sketch_start_addr", sketch_start_addr);
  sk_data = await writeArrayToNVM(port, md, sketch_start_addr, result);
  if (sk_data == null) {
    console.error("Не удалось залить скетч");
    return ;
  }
  crc16 = calcSigmaCRC16(0x1D0F, sk_data, 0, sk_data.length);
  console.log("crc16 скетча", crc16);
  res = await pushSketch(port, sketch_start_addr, sk_data.length, crc16);
  if (res[0] != RECV_OK) {
    console.error("Не удалось применить скетч");
    return ;
  }
  if(res[4] == 0xFE) {
    console.error("Can't upload sketch! Something went wrong. Bad CRC16 :'( .");
    return ;
  }
  port.close();
  console.info("Скетч успешно залит!!!");
}
