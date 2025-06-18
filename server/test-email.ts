import { notificationService } from './notification-service.js';

async function testEmail() {
  console.log('Testing email service...');
  
  try {
    await notificationService.sendWelcomeAndVerificationEmail(
      'contact@afrisoutien.com',
      'test-token-123'
    );
    console.log('Email test completed successfully');
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();