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
    /**
     * Set the address of the device
     * @param addr the new address of this device
     */

    //% blockId="device_set_address" block="%device|set the device address %addr"
    //% weight=10 blockGap=8
    //% parts="KS103"
    public setAddress(addr: number): void {
      this.i2c_addr = addr;
    }
  }
}
