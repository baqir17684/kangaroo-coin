export default function apiCallGet (path, token) {
  return fetch('http://localhost:5005/' + path, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        return data;
      }
    });
}
