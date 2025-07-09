import { ConflictError } from './conflict.error';

export class EmailAlreadyRegisteredError extends ConflictError {}
export class CpfAlreadyRegisteredError extends ConflictError {}
export class InvalidPasswordError extends Error {}
export class InvalidWhatsappError extends Error {}
export class InvalidUrlError extends Error {}
export class InvalidZipCodeError extends Error {}
