//% color="#2c7f55" weight=100
namespace KS103 {
  export enum Address {
    // 7-bit I2C addresses for KS103
    //% block="0x74"
    ADDR_0x74 = 0x74 // default
  }

  /**
   * An KS103 Device
   */
  export class Device {
    i2c_addr: number;
    err_msg: string;
    /**
     * Set the address of the device
     * @param addr the new address of this device
     */

    //% blockId="device_initial" block="%device|initial the device"
    //% weight=10 blockGap=8
    //% parts="KS103"
    public initial(addr: number): void {
      let wbuf = pins.createBuffer(2);

      wbuf.setNumber(NumberFormat.UInt8LE, 0, 0x02);
      wbuf.setNumber(NumberFormat.UInt8LE, 1, 0x72);

      let result = pins.i2cWriteBuffer(this.i2c_addr, wbuf);
      if (result != 0) {
        this.err_msg = "I2C write failed";
        return null;
      }
    }

    //% blockId="device_set_address" block="%device|set the device address %addr"
    //% weight=10 blockGap=8
    //% parts="KS103"
    public setAddress(addr: number): void {
      this.i2c_addr = addr;
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

    /**
     * read data from sensor
     */

    //% blockId="device_read_data" block="%device|read data from sensor"
    //% weight=30 blockGap=8
    //% parts="KS103"
    public readData(): number[] {
      let values: number[] = [0, 0];
      let wbuf = pins.createBuffer(2);
      this.err_msg = "";

      // single shot mode, no clock stretching
      wbuf.setNumber(NumberFormat.UInt8LE, 0, 0x2c);
      wbuf.setNumber(NumberFormat.UInt8LE, 1, 0x06);
      let result = pins.i2cWriteBuffer(this.i2c_addr, wbuf);
      if (result != 0) {
        this.err_msg = "I2C write failed";
        return null;
      }

      basic.pause(20);

      let buf = pins.i2cReadBuffer(this.i2c_addr, 6);
      if (buf.length == 6) {
        let t_hi = buf.getNumber(NumberFormat.UInt8LE, 0);
        let t_lo = buf.getNumber(NumberFormat.UInt8LE, 1);
        let t_crc = buf.getNumber(NumberFormat.UInt8LE, 2);
        let t_value = (t_hi << 8) | t_lo;

        let h_hi = buf.getNumber(NumberFormat.UInt8LE, 3);
        let h_lo = buf.getNumber(NumberFormat.UInt8LE, 4);
        let h_crc = buf.getNumber(NumberFormat.UInt8LE, 5);
        let h_value = (h_hi << 8) | h_lo;

        if (this.crc8(t_hi, t_lo) == t_crc) {
          // crc ok for temperature
          t_value = (t_value * 175.0) / 65535 - 45; // temperature in Celsius.
          values[0] = t_value;
          this._temp = t_value;
        } else {
          this.err_msg = "CRC failed (Temperature)";
          return null;
        }

        if (this.crc8(h_hi, h_lo) == h_crc) {
          // crc ok for humidity
          h_value = (h_value * 100.0) / 65535; // relative humidity
          values[1] = h_value;
          this._humid = h_value;
        } else {
          this.err_msg = "CRC failed (Humidity)";
          return null;
        }
        return values;
      }
      this.err_msg = "I2C read failed";
      return null;
    }
  }

  /**
   * Create a new KS103 device
   */
  //% blockId="KS103_CREATE_DEVICE" block="KS103 create a device"
  //% weight=100 blockGap=8
  //% parts="KS103"
  //% blockSetVariable=device
  export function create(addr: Address = Address.ADDR_0x74): Device {
    let device = new Device();
    device.i2c_addr = addr;
    return device;
  }
}
