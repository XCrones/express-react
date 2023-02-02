import express from "express";

export interface TypedRequestBody<T> extends express.Request {
  body: T;
}

export interface TypedResponseBody extends express.Response {}
