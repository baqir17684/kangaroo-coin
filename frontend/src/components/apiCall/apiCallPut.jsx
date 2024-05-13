export default function apiCallPut (path, token, body) {
  fetch('http://localhost:5005/' + path, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log('');
      }
    });
}
