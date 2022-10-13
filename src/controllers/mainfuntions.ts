module.exports = {
  limitPage: async (limit: Number, page: Number) => {
    try {
      let pageData: Number = page ? page : 1
      let limitData: Number = limit ? limit : 10
      let skip: Number = Number(limitData) * (Number(pageData) - 1)
      let result: object = {
        limit: Number(limitData),
        skip: Number(skip)
      }
      return result
    } catch (error) {
      return error
    }
  },
}