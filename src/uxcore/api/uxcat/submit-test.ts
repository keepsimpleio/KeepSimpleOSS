import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getUXCatSubmitTest = async (
  testId: number,
  questionId: number,
  answerId: number,
  token?: string,
) => {
  const url = `${UxCatRoute}tests/${testId}/questions/${questionId}/${answerId}/submit`;
  const body = JSON.stringify({
    timestamp: Date.now(),
    system: 'uxcat',
  });

  const headers = {
    'Content-Type': 'application/json',
    accessToken: token,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error('Failed to submit test');
    }

    return response.json();
  } catch (error) {
    console.error('Error submitting test:', error);
    return null;
  }
};
