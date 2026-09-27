/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AgentsService } from './services/AgentsService';
import { HospitalsService } from './services/HospitalsService';
import { NeighborhoodsService } from './services/NeighborhoodsService';
import { PriceHistoryService } from './services/PriceHistoryService';
import { PropertiesService } from './services/PropertiesService';
import { SchemaService } from './services/SchemaService';
import { SchoolsService } from './services/SchoolsService';
import { TaxHistoryService } from './services/TaxHistoryService';
import { TokenService } from './services/TokenService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly agents: AgentsService;
    public readonly hospitals: HospitalsService;
    public readonly neighborhoods: NeighborhoodsService;
    public readonly priceHistory: PriceHistoryService;
    public readonly properties: PropertiesService;
    public readonly schema: SchemaService;
    public readonly schools: SchoolsService;
    public readonly taxHistory: TaxHistoryService;
    public readonly token: TokenService;
    public readonly users: UsersService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.agents = new AgentsService(this.request);
        this.hospitals = new HospitalsService(this.request);
        this.neighborhoods = new NeighborhoodsService(this.request);
        this.priceHistory = new PriceHistoryService(this.request);
        this.properties = new PropertiesService(this.request);
        this.schema = new SchemaService(this.request);
        this.schools = new SchoolsService(this.request);
        this.taxHistory = new TaxHistoryService(this.request);
        this.token = new TokenService(this.request);
        this.users = new UsersService(this.request);
    }
}

