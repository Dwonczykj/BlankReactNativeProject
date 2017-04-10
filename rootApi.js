export const getResponse = (request) => {
  return fetch(request)
  .then(result=> {
    return result;
  })
  .catch(er=> {
    throw {
      error: er
    };
  });
};
