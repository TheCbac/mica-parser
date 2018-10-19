/* **********************************************************
* File: src/micaParser.test.js
*
* Brief: Parser for MICA packets
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */
import {
    commandToModule,
    computeChecksum16,
    processRxByte,
    resetRxBuffer,
    resetTxBuffer,
    constructPacket,
    getTxBuffer
} from './micaParser';

describe('Command to module', () => {
    test('Control command', () => {
        expect(commandToModule(0x00)).toBe('control');
        expect(commandToModule(0x01)).toBe('control');
        expect(commandToModule(0x1F)).toBe('control');
        expect(commandToModule(0x80)).toBe('control');
        expect(commandToModule(0x81)).toBe('control');
        expect(commandToModule(0x9F)).toBe('control');
    });
    
    test('Actuation command', () => {
        expect(commandToModule(0x20)).toBe('actuation');
        expect(commandToModule(0x25)).toBe('actuation');
        expect(commandToModule(0x3F)).toBe('actuation');
        expect(commandToModule(0xA0)).toBe('actuation');
        expect(commandToModule(0xB3)).toBe('actuation');
        expect(commandToModule(0xBF)).toBe('actuation');
    });
    
    test('Sensing command', () => {
        expect(commandToModule(0x40)).toBe('sensing');
        expect(commandToModule(0x44)).toBe('sensing');
        expect(commandToModule(0x5F)).toBe('sensing');
        expect(commandToModule(0xC0)).toBe('sensing');
        expect(commandToModule(0xCA)).toBe('sensing');
        expect(commandToModule(0xDF)).toBe('sensing');
    });
    
    test('Energy command', () => {
        expect(commandToModule(0x60)).toBe('energy');
        expect(commandToModule(0x7A)).toBe('energy');
        expect(commandToModule(0x7F)).toBe('energy');
        expect(commandToModule(0xE0)).toBe('energy');
        expect(commandToModule(0xEB)).toBe('energy');
        expect(commandToModule(0xFF)).toBe('energy');
    });
});

describe('ComputeChecksum16', () => {
    test('Basic checksum', () => {
        const arr = [0x01];
        const {msb, lsb} = computeChecksum16(arr);
        expect(msb).toBe(0xFF)
        expect(lsb).toBe(0xFF)

    });
    test('no payload checksum', () => {
        const arr = [0x01, 0x00, 0x00, 0x03, 0x01, 0x03, 0x05, 0x00, 0x00];
        const {msb, lsb} = computeChecksum16(arr);
        expect(msb).toBe(0xFF)
        expect(lsb).toBe(0xF3)

    });
    test('payload checksum', () => {
        const arr = [0x01, 0x40, 0x00, 0x02, 0xFF, 0xFF, 0x00, 0x00];
        const {msb, lsb} = computeChecksum16(arr);
        expect(msb).toBe(0xFD)
        expect(lsb).toBe(0xBF)

    });
    test('Buffer', () => {
        const arr = [0x01, 0x40, 0x00, 0x02, 0xFF, 0xFF, 0x00, 0x00];
        const {msb, lsb} = computeChecksum16(Buffer.from(arr));
        expect(msb).toBe(0xFD)
        expect(lsb).toBe(0xBF)

    });
});

describe('processRxByte', () => {
    beforeEach(() => {
        resetRxBuffer();
    });
    test('Valid start', () => {
        expect(processRxByte(0x01)).toEqual({
            complete: false,
            success: true,
            err: ''
        });
    });
    test('Invalid start', () => {
        expect(processRxByte(0x02)).toEqual({
            complete: false,
            success: false,
            err: 'Invalid start symbol'
        });
    });
    test('basic packet, no payload', () => {
        const arr = [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xAA];
        let i;
        for(i = 0; i < arr.length - 1; i++){
            expect(processRxByte(arr[i])).toEqual({ complete: false, success: true, err: ''});
        }
        /* Process last byte */
        expect(processRxByte(arr[i])).toEqual({ complete: true, success: true, err: ''});
    });
    test('basic packet, with payload', () => {
        const arr = [0x01, 0x05, 0x00, 0x02, 0xFF, 0xFF, 0x00, 0x00, 0xFD, 0xFA, 0xAA];
        let i;
        for(i = 0; i < arr.length - 1; i++){
            expect(processRxByte(arr[i])).toEqual({ complete: false, success: true, err: ''});
        }
        /* Process last byte */
        expect(processRxByte(arr[i])).toEqual({ complete: true, success: true, err: ''});
    });
    test('completed packet', () => {
        const arr = [0x01, 0x05, 0x00, 0x02, 0xFF, 0xFF, 0x00, 0x00, 0xFD, 0xFA, 0xAA];
        let i;
        for(i = 0; i < arr.length - 1; i++){
            expect(processRxByte(arr[i])).toEqual({ complete: false, success: true, err: ''});
        }
        /* Process last byte */
        expect(processRxByte(arr[i])).toEqual({ complete: true, success: true, err: ''});
        /* Process additional byte */
        expect(processRxByte(0x01)).toEqual({ complete: true, success: false, err: 'Completed packet has not been handled yet'});
        
    });
});

describe('constructPacket', () => {
    beforeEach(() => {
        resetTxBuffer();
    });
    test('Basic packet', () => {
        const packet = {
            module: 'control',
            cmd: 0x00,
            payload: [],
            flags: 0x00
        };
        expect(constructPacket(packet)).toEqual({ success: true, err: '' });
    });
    test('Double creation', () => {
        const packet = {
            module: 'control',
            cmd: 0x00,
            payload: [],
            flags: 0x00
        };
        expect(constructPacket(packet)).toEqual({ success: true, err: '' });
        expect(constructPacket(packet)).toEqual({ success: true, err: '' });
    });
    test('Basic packet - check content', () => {
        const packet = {
            module: 'control',
            cmd: 0x00,
            payload: [],
            flags: 0x00
        };
        expect(constructPacket(packet)).toEqual({ success: true, err: '' });
        /* get the content */
        expect(getTxBuffer()).toEqual([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xAA]);
    });
});


/* [] - END OF FILE */
