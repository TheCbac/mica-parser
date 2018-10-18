/* @flow */
/* **********************************************************
* File: src/micaParser.js
*
* Brief: Parser for MICA packets
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */
import type {moduleName_T} from './micaParser.types'

const packets_RSP_BIT_SHIFT = 7; /**< Shift of the bit that indicates the packet contains a response */
const packets_RSP_BIT = (1 << packets_RSP_BIT_SHIFT); /**< Bit that indicates the packet contains a response */

const packets_CMD_MIN            = (0x00);  /**< Start of the host command space */
const packets_CMD_MAX            = (0x7F);  /**< End of the host command space */
const packets_CMD_CONTROL_MIN    = (0x00);  /**< Start of the host control command space */
const packets_CMD_CONTROL_MAX    = (0x1F);  /**< End of the host control command space */
const packets_CMD_ACTUATION_MIN  = (0x20);  /**< Start of the host actuation command space */
const packets_CMD_ACTUATION_MAX  = (0x3F);  /**< End of the host actuation command space */
const packets_CMD_SENSING_MIN    = (0x40);  /**< Start of the host sensing command space */
const packets_CMD_SENSING_MAX    = (0x5F);  /**< End of the host sensing command space */
const packets_CMD_ENERGY_MIN     = (0x60);  /**< Start of the host energy command space */
const packets_CMD_ENERGY_MAX     = (0x7F);  /**< End of the host energy command space */

export function commandToModule(cmd: number): moduleName_T {
    /* Mask the response flag */
    cmd &= ~packets_RSP_BIT;
    /* Check the command */
    if (cmd >= packets_CMD_CONTROL_MIN && cmd <= packets_CMD_CONTROL_MAX) {
        return 'control';
    } else if (cmd >= packets_CMD_ACTUATION_MIN && cmd <= packets_CMD_ACTUATION_MAX){
        return 'actuation';   
    } else if (cmd >= packets_CMD_SENSING_MIN && cmd <= packets_CMD_SENSING_MAX){
        return 'sensing';  
    }  else if (cmd >= packets_CMD_ENERGY_MIN && cmd <= packets_CMD_ENERGY_MAX){
        return 'energy';
    } 
    return 'unknown';
}

export function processRxByte(rxByte: number)  {

}

/* [] - END OF FILE */
