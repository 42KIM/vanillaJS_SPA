const API_END_POINT =
  'https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev';

const request = async (param) => {
  try {
    const res = await fetch(`${API_END_POINT}${param}`);

    if (!res.ok) {
      throw new Error('api request failed!');
    }

    return await res.json();
  } catch (e) {
    alert(e.message);
  }
};

export { request };
