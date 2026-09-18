export {};

declare global {
  interface Navigator {
    gpu: GPU;
  }
  interface Window {
    gpu: GPU;
  }

  interface GPU {
    requestAdapter: () => Promise<GPUAdapter | null>;
  }

  interface GPUAdapter {
    requestDevice: () => Promise<GPUDevice | null>;
  }

  interface GPUDevice {
    query: (type: string) => string;
    limits: Record<string, number>;
  }
}
