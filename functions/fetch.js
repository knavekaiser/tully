exports.handler = function (e, ctx, callback) {
  const { API, API_KEY } = process.env;
  const send = (body) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };
  const fetchData = () => {
    fetch(API + "/1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
    })
      .then((res) => send(res.data))
      .catch((err) => send(err));
  };
  if (e.httpMethod === "GET") {
    fetchData();
  }
};
