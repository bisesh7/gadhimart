import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import axios from "axios";

const apiUrl = "http://localhost:5000";
const httpClient = fetchUtils.fetchJson;

export default {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };

    const url = `${apiUrl}/api/${resource}?${stringify(query)}`;
    return axios
      .get(url, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then((res) => ({
        data: res.data.data,
        total: res.data.total,
      }));
  },

  getOne: (resource, params) =>
    axios
      .get(`${apiUrl}/api/${resource}/${params.id}`, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => ({ data: data.data })),

  // getMany: (resource, params) => {
  //   const query = {
  //     filter: JSON.stringify({ id: params.ids }),
  //   };
  //   const url = `${apiUrl}/api/${resource}?${stringify(query)}`;
  //   return httpClient(url).then(({ json }) => ({ data: json.data }));
  // },

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/api/${resource}?${stringify(query)}`;
    return axios
      .get(url, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => ({ data: data.data }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/api/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    }));
  },

  update: (resource, params) => {
    params.data.valid = process.env.REACT_APP_ADMIN_KEY;

    return axios
      .put(`${apiUrl}/api/${resource}/${params.id}`, {
        data: params.data,
      })
      .then(({ data }) => ({
        data,
      }));
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/api/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json.success }));
  },

  create: (resource, params) =>
    axios
      .post(`${apiUrl}/api/${resource}`, {
        data: params.data,
        valid: process.env.REACT_APP_ADMIN_KEY,
      })
      .then(({ data }) => ({
        data: { ...params.data, id: data.id },
      })),

  delete: (resource, params) =>
    axios
      .delete(`${apiUrl}/api/${resource}/${params.id}`, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => ({
        data,
      })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return axios
      .delete(`${apiUrl}/api/${resource}?${stringify(query)}`, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => ({
        data,
      }));
  },
};
