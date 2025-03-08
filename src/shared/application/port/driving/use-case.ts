export interface PortDrivingUseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}
