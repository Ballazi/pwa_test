import instance from "../api";
import dayjs from "dayjs";

export const viewShiper = () => {
  let url = "/shipper/";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const viewVehicle = () => {
  let url = "/master/fleet/";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const viewMaterials = () => {
  let url = "/master/material/";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const viewNetWork = () => {
  let url = "/master/networkprovider/";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const viewTransporter = (data) => {
  let url = `/shipper/transporter/?shipperId=${data.shipper_id}&status=allowed`;
  return instance.get(url);
};

export const postSave = () => {
  let url = "/track/fleet/";
};

export const save = (
  data,
  addressvalues,

  checkInTimeFrom,
  checkOutTimeTo,
  loadingStartTime,
  loadingEndTime,
  company_docs,
  vehicle_docs,
  eWayBillDate,
  eta
  // bidDateTime
) => {
  console.log("formdate", data.eWayBillTime);
  const date = checkInTimeFrom ? dayjs(checkInTimeFrom) : null;
  const dateTo = checkOutTimeTo ? dayjs(checkOutTimeTo) : null;
  const loadStart = loadingStartTime ? dayjs(loadingStartTime) : null;
  const loadEnd = loadingEndTime ? dayjs(loadingEndTime) : null;
  const eWayDate = eWayBillDate ? dayjs(eWayBillDate).endOf("day") : null;
  // const bid = dayjs(bidDateTime);
  console.log("date", date);

  let url = "/track/fleet/";
  console.log("datataa", dateTo, loadEnd, loadStart);
  console.log("address", addressvalues);
  const payload = {
    tf_shipper_id:
      localStorage.getItem("user_type") === "acu"
        ? data.shipper
        : localStorage.getItem("user_id"),
    tf_transporter_id: data.transporter,
    tf_fleet_type_id: data.vehicleType,
    src_addrs:
      addressvalues[0].load_source["src_city"] +
      " " +
      addressvalues[0].load_source["src_state"] +
      " " +
      addressvalues[0].load_source["src_country"],
    src_lat: addressvalues[0].load_source["lat"],
    src_long: addressvalues[0].load_source["lng"],
    dest_addrs:
      addressvalues[0].load_dest["src_city"] +
      " " +
      addressvalues[0].load_dest["src_state"] +
      " " +
      addressvalues[0].load_dest["src_country"],
    dest_lat: addressvalues[0].load_dest["lat"],
    dest_long: addressvalues[0].load_dest["lng"],
    fleet_no: data.noOfVehicle,
    // driver_name: data.customerContactName,
    driver_number: data.driverContactNumber,
    comment: data.comment,
    tf_region_cluster_id:
      data.region && data.region != "null" ? data.region : null,
    tf_branch_id: data.branch && data.branch != "null" ? data.branch : null,
    customer_no: data.contactNumber,
    customer_name: data.customerContactName,
    tf_netw_srvc_prvd_id: data.networkProvider,
    alternate_driver_number: data.alternate_driver_number
      ? data.alternate_driver_number
      : null,
    tf_altr_netw_srvc_prvd_id: data.tf_altr_netw_srvc_prvd_id
      ? data.tf_altr_netw_srvc_prvd_id
      : null,
    gate_in: date ? date.format("YYYY-MM-DD HH:mm:ss.SSS") : null,
    // vehicle_doc: "2023-09-29T09:20:18.358Z",
    vehicle_doc_link: vehicle_docs.map((i) => ({
      file_name: i.file_name,
      file_data: i.file_data,
    })),
    loading_start: loadStart
      ? loadStart.format("YYYY-MM-DD HH:mm:ss.SSS")
      : null,
    loading_end: loadEnd ? loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS") : null,
    company_doc_link: company_docs.map((i) => ({
      file_name: i.file_name,
      file_data: i.file_data,
    })),
    estimated_time: eta,

    gate_out: dateTo ? dateTo.format("YYYY-MM-DD HH:mm:ss.SSS") : null,

    eway: data.ewayBill,
    eway_expire: data.eWayBillTime
      ? data.eWayBillTime.format("YYYY-MM-DD HH:mm:ss.SSS")
      : null,
    make_of_gps: null,

    is_tracking_enable: true,

    materials: data.materialType
      ? data.materialType.map((val) => {
          return {
            mlm_material_id: val,
            qty: 0,
          };
        })
      : [],

    src_dest: addressvalues.map((value, index) => {
      return {
        src_street_address: value.load_source.src_city,
        src_city: value.load_source.src_city,
        src_state: value.load_source.src_state,
        src_postal_code: null,
        src_country: value.load_source.src_country,
        src_lat: value.load_source.lat,
        src_long: value.load_source.lng,
        dest_street_address: value.load_dest.src_city,
        dest_city: value.load_dest.src_city,
        dest_state: value.load_dest.src_state,
        dest_postal_code: null,
        dest_country: value.load_dest.src_country,
        dest_lat: value.load_dest.lat,
        dest_long: value.load_dest.lng,
        is_prime: value.is_prime,
      };
    }),
  };

  console.log("====>", payload);
  return instance
    .post(url, payload)
    .then((response) => {
      if (response.data.success === true) {
        console.log("response of trip", response);
        return response;
      } else {
        return response;
      }
    })
    .catch((error) => {
      return error.response;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const update = (
  data,
  row,
  addressvalues,

  checkInTimeFrom,
  checkOutTimeTo,
  loadingStartTime,
  loadingEndTime,
  company_docs,
  vehicle_docs,
  eWayBillDate,
  eta,
  updatedSourceDest
  // bidDateTime
) => {
  const date = checkInTimeFrom ? dayjs(checkInTimeFrom) : null;

  const dateTo = checkOutTimeTo ? dayjs(checkOutTimeTo) : null;
  const loadStart = loadingStartTime ? dayjs(loadingStartTime) : null;
  const loadEnd = loadingEndTime ? dayjs(loadingEndTime) : null;
  const eWayDate = eWayBillDate ? dayjs(eWayBillDate).endOf("day") : null;
  // const bid = dayjs(bidDateTime);
  console.log("date in api", data);

  let url = `/track/fleet/${row.id}`;
  console.log("datataa", dateTo, loadEnd, loadStart);
  console.log("address", addressvalues);
  const payload = {
    tf_shipper_id:
      localStorage.getItem("user_type") === "acu"
        ? data.shipper
        : localStorage.getItem("user_id"),
    tf_transporter_id: data.transporter,
    tf_fleet_type_id: data.vehicleType,
    src_addrs:
      addressvalues[0].load_source["src_city"] +
      " " +
      addressvalues[0].load_source["src_state"] +
      " " +
      addressvalues[0].load_source["src_country"],
    src_lat: addressvalues[0].load_source["lat"],
    src_long: addressvalues[0].load_source["lng"],
    dest_addrs:
      addressvalues[0].load_dest["src_city"] +
      " " +
      addressvalues[0].load_dest["src_state"] +
      " " +
      addressvalues[0].load_dest["src_country"],
    dest_lat: addressvalues[0].load_dest["lat"],
    dest_long: addressvalues[0].load_dest["lng"],
    fleet_no: data.noOfVehicle,
    // driver_name: data.customerContactName,
    driver_number: data.driverContactNumber,
    customer_no: data.contactNumber,
    customer_name: data.customerContactName,
    tf_netw_srvc_prvd_id: data.networkProvider,
    alternate_driver_number: data.alterContactNumber
      ? data.alternate_driver_number
      : null,
    tf_altr_netw_srvc_prvd_id: data.alterNetworkProvider
      ? data.tf_altr_netw_srvc_prvd_id
      : null,
    gate_in:
      date.format("YYYY-MM-DD HH:mm:ss.SSS") === "Invalid Date"
        ? null
        : date.format("YYYY-MM-DD HH:mm:ss.SSS"),
    // vehicle_doc: "2023-09-29T09:20:18.358Z",
    vehicle_doc_link: vehicle_docs?.map((i) => ({
      file_name: i.file_name,
      file_data: i.file_data,
    })),
    loading_start:
      loadStart.format("YYYY-MM-DD HH:mm:ss.SSS") === "Invalid Date"
        ? null
        : loadStart.format("YYYY-MM-DD HH:mm:ss.SSS"),

    loading_end:
      loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS") === "Invalid Date"
        ? null
        : loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS"),
    company_doc_link: company_docs?.map((i) => ({
      file_name: i.file_name,
      file_data: i.file_data,
    })),
    estimated_time: eta,

    gate_out:
      dateTo.format("YYYY-MM-DD HH:mm:ss.SSS") === "Invalid Date"
        ? null
        : dateTo.format("YYYY-MM-DD HH:mm:ss.SSS"),

    eway: data.ewayBill,
    eway_expire:
      data.eWayBillTime.format("YYYY-MM-DD HH:mm:ss.SSS") === "Invalid Date"
        ? null
        : data.eWayBillTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
    make_of_gps: null,

    is_tracking_enable: true,

    materials: data.materialType
      ? data.materialType.map((val) => {
          return {
            mlm_material_id: val,
            qty: 0,
          };
        })
      : [],

    src_dest: addressvalues.map((value, index) => {
      return {
        src_street_address: value.load_source.src_city,
        src_city: value.load_source.src_city,
        src_state: value.load_source.src_state,
        src_postal_code: null,
        src_country: value.load_source.src_country,
        src_lat: value.load_source.lat,
        src_long: value.load_source.lng,
        dest_street_address: value.load_dest.src_city,
        dest_city: value.load_dest.src_city,
        dest_state: value.load_dest.src_state,
        dest_postal_code: null,
        dest_country: value.load_dest.src_country,
        dest_lat: value.load_dest.lat,
        dest_long: value.load_dest.lng,
        is_prime: value.is_prime,
      };
    }),
  };

  console.log("====>", payload);
  return instance
    .patch(url, payload)
    .then((response) => {
      if (response.data.success === true) {
        console.log("response of trip", response);
        return response;
      } else {
        return response;
      }
    })
    .catch((error) => {
      return error.response;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};
