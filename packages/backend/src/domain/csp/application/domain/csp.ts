export type DomainCSP = {
  timestamp: Date;
  "csp-report": {
    "blocked-uri": string;
    disposition: string;
    "document-uri": string;
    "effective-directive": string;
    "original-policy": string;
    "script-sample": string;
    referrer: string;
    "status-code": number;
    "violated-directive": string;
  };
  id: string;
};
