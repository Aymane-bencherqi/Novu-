import { connect } from './connect-to-dal';
import { EnvironmentRepository } from '@novu/dal';
import { GenerateUniqueApiKey } from '../src/app/environments-v1/usecases/generate-unique-api-key/generate-unique-api-key.usecase';
import { encryptApiKey } from '@novu/application-generic';
import { createHash } from 'crypto';

async function generateApiKeyForEnvironment(environmentId: string, userId: string) {
  const environmentRepository = new EnvironmentRepository();
  const generateUniqueApiKey = new GenerateUniqueApiKey(environmentRepository);

  // Generate a new API key
  const key = await generateUniqueApiKey.execute();
  const encryptedApiKey = encryptApiKey(key);
  const hashedApiKey = createHash('sha256').update(key).digest('hex');

  // Update the environment with the new API key
  const environments = await environmentRepository.updateApiKey(
    environmentId,
    encryptedApiKey,
    userId,
    hashedApiKey
  );

  console.log('Generated API Key:', key);
  console.log('Environment updated successfully');
  
  return { key, environments };
}

// Usage example
async function main() {
  const environmentId = process.argv[2];
  const userId = process.argv[3];

  if (!environmentId || !userId) {
    console.error('Usage: npm run admin:generate-api-key <environmentId> <userId>');
    process.exit(1);
  }

  await connect(async () => {
    await generateApiKeyForEnvironment(environmentId, userId);
  });
}

if (require.main === module) {
  main().catch(console.error);
} 
