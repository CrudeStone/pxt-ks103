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
