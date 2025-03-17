import type {
  Job,
  JobOptions,
  ProcessCallbackFunction,
  ProcessPromiseFunction,
} from "bull";

export interface PortQueue<T> {
  add(data: T, opts?: JobOptions): Promise<Job<T>>;
  process(callback: ProcessCallbackFunction<T>): Promise<void>;
  process(callback: ProcessPromiseFunction<T>): Promise<void>;
}
