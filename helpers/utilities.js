const setResponse = (status, message, data) => {
  let response = {};

  switch (status) {
    case 200:
      response = {
        status: status,
        message: message,
        data: data,
        error: false,
      };
      break;

    case 400:
      response = {
        status: status,
        message: message ? message : "Missing params",
        data: data,
        error: true,
      };
      break;

    case 500:
      response = {
        status: status,
        message: message ? message : "Something went wrong",
        data: data,
        error: true,
      };
      break;
  }

  return response;
};

exports.setResponse = setResponse;
