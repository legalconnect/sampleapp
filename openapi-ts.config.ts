
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  base: 'https://staging.legalconnectonline.com/developer-dashboard-httpaggregator',
  client: 'axios',
  format: 'prettier',
  input: 'https://staging.legalconnectonline.com/developer-dashboard-httpaggregator/swagger/v1/swagger.yaml',
  output: './src/services',
  debug: true
});