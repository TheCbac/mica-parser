/* **********************************************************
* File: src/micaParser.test.js
*
* Brief: Parser for MICA packets
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */
import {commandToModule} from './micaParser';

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

/* [] - END OF FILE */
