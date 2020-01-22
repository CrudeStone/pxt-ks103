/**
 * KS103 block
 */
//% weight=100 color=#70c0f0 icon="\uf042" block="KS103"
namespace ks103 {
  export enum I2C_ADDRESS {
    //% block="0x74"
    ADDR_0x74 = 0x74
  }

  const REG_ADDRESS = 0x02;

  export class Device {
    i2c_addr: number;
    err_msg: string;

    /**
     * Set the address of the device
     * @param addr the new address of this device
     */

    //% blockId="device_init" block="init ks103 | %device"
    //% weight=10 blockGap=8
    //% parts="KS103"
    public init(): void {
      let wbuf = pins.createBuffer(2);
      this.err_msg = "";

      // single shot mode, no clock stretching
      wbuf.setNumber(NumberFormat.UInt8LE, 0, REG_ADDRESS);
      wbuf.setNumber(NumberFormat.UInt8LE, 1, 0x71);
      let result = pins.i2cWriteBuffer(this.i2c_addr, wbuf);
      if (result != 0) {
        this.err_msg = "I2C write failed";
        return null;
      }
    }

    public getRange(): number {
      let wbuf = pins.createBuffer(2);
      let range = 0;
      this.err_msg = "";

      wbuf.setNumber(NumberFormat.UInt8LE, 0, REG_ADDRESS);
      wbuf.setNumber(NumberFormat.UInt8LE, 1, 0xb4);

      pins.i2cWriteBuffer(this.i2c_addr, wbuf);

      basic.pause(100);

      wbuf = pins.createBuffer(1);
      wbuf.setNumber(NumberFormat.UInt8LE, 0, REG_ADDRESS);

      pins.i2cWriteBuffer(this.i2c_addr, wbuf);

      let buf = pins.i2cReadBuffer(this.i2c_addr, 2);
      if (buf.length == 2) {
        let highByte = buf.getNumber(NumberFormat.UInt8LE, 0);
        let lowByte = buf.getNumber(NumberFormat.UInt8LE, 1);

        range = (highByte << 8) + lowByte;

        return range;
      }

      this.err_msg = "I2C read failed";

      return -1;
    }

    /**
     * get error message
     */

    //% blockId="device_get_error_msg" block="%device|get error message"
    //% weight=40 blockGap=8
    //% parts="KS103"
    public getErrorMessage(): string {
      return this.err_msg;
    }
  }

  /**
   * Create a new KS103 device
   */
  //% blockId="KS103_CREATE_DEVICE" block="KS103 create a device"
  //% weight=100 blockGap=8
  //% parts="KS103"
  //% blockSetVariable=device
  export function create(addr: I2C_ADDRESS = I2C_ADDRESS.ADDR_0x74): Device {
    let device = new Device();
    device.i2c_addr = addr;
    return device;
  }
}
