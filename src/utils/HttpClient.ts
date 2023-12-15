import {GM, GmXhrRequest} from '$';

type ResponseTypeMap = {
  text: string;
  json: any;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  document: Document;
  stream: ReadableStream<Uint8Array>;
};

type ResponseType = keyof ResponseTypeMap;

export interface HttpResponse<D, RT extends ResponseType> {
  responseHeaders: string;
  readyState: 0 | 1 | 2 | 3 | 4;
  response: ResponseTypeMap[RT];
  responseText: string;
  responseXML: Document | null;
  status: number;
  statusText: string;
  data?: D;
}

export default class HttpClient {
  constructor() {}

  private sendRequest<D, CTX, RT extends ResponseType>(
    details: GmXhrRequest<CTX, RT>
  ): Promise<HttpResponse<D, RT>> {
    return new Promise((resolve, reject) => {
      details.onload = (event) => {
        if (details.onload != undefined) details.onload.call(event, event);
        const response = {
          responseHeaders: event.responseHeaders,
          readyState: event.readyState,
          response: event.response,
          responseText: event.responseText,
          responseXML: event.responseXML,
          status: event.status,
          statusText: event.statusText,
        } as HttpResponse<D, RT>;
        if (details.responseType === "json") {
          response.data = event.response as D;
        }
        resolve(response);
      };
      details.onerror = (event) => {
        if (details.onerror != undefined) details.onerror.call(event, event);
        reject(event);
      };
      GM.xmlHttpRequest(details);
    });
  }

  get<D, CTX, RT extends ResponseType>(
    options: GmXhrRequest<CTX, RT>
  ): Promise<HttpResponse<D, RT>> {
    const details: GmXhrRequest<CTX, RT> = {url: ""};
    Object.assign(details, options);
    details.method = "GET";
    return this.sendRequest<D, CTX, RT>(details);
  }

  post<D, CTX, RT extends ResponseType>(
    options: GmXhrRequest<CTX, RT>
  ): Promise<HttpResponse<D, RT>> {
    const details: GmXhrRequest<CTX, RT> = {url: ""};
    Object.assign(details, options);
    details.method = "POST";
    return this.sendRequest<D, CTX, RT>(details);
  }
}