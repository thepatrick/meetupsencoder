declare module '@google-cloud/compute' {

  export interface Operation<T> {
    promise(): Promise<T>;
  }

  export interface Zone {
    createVM(
      name: string,
      config: {
        http?: boolean;
        https?: boolean;
        machineType: string;
        os?: string;
        tags?: string[];
        scheduling?: {
          preemptible?: boolean;
        };
        metadata?: {
          items: {
            key: string;
            value: string;
          }[];
        };
        serviceAccounts?: {
          email?: string;
          scopes?: string[];
        }[];
        networkInterfaces: [
          {
            network: string;
            accessConfigs: [
              {
                type: string;
                name: string;
                networkTier: string;
              }
            ]
          }
        ],
        disks?: {
          type: string;
          boot: boolean;
          mode: string;
          autoDelete: boolean;
          deviceName: string;
          initializeParams: {
            sourceImage: string;
            diskSizeGb: string;
            diskType?: string;
          },
          diskEncryptionKey: {},
        }[],
      },
    ): Promise<[unknown, Operation<unknown>]>; // vm, operation
  }

  export default class Compute {
    zone(name: string): Zone;
  }

}