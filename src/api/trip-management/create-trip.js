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
export const viewShiperBidding = () => {
  let url = "/master/module/shippers/bidding";
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
export const viewShipperTracking = () => {
  let url = "/master/module/shippers/tracking";
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

export const getRegion = (data) => {
  let url = `/shipper/regioncluster/?shipperId=${data.shipper_id}`;
  return instance.get(url);
};

export const viewBranch = (data) => {
  let url = "";
  console.log("error", data.msrc_region_cluster_id);

  if (data.msrc_region_cluster_id === undefined) {
    url = `/shipper/branch/?shipperId=${data.shipper_id} `;
  } else {
    url = `/shipper/branch/?shipperId=${data.shipper_id}&regionClusterId=${data.msrc_region_cluster_id} `;
  }
  return instance.get(url);
};

export const viewBranchOnly = (data) => {
  let url = `/shipper/branch/?shipperId=${data.shipper_id}`;
  return instance.get(url);
};

export const viewBid = (data) => {
  let url = `/shipper/settings/bid/?shipperId=${data.shipper_id}`;
  return instance.get(url);
};

export const viewComment = (data) => {
  let url = `/shipper/comment/?shipperid=${data.shipper_id}&type=bidding`;
  return instance.get(url);
};
export const viewCommentForTracking = (data) => {
  let url = `/shipper/comment/?shipperid=${data.shipper_id}&type=tracking`;
  return instance.get(url);
};
export const viewSegment = (data) => {
  let url = `/shipper/segment/?shipperId=${data.shipper_id}`;
  return instance.get(url);
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

export const save = (
  data,
  addressvalues,
  comment,
  reportingFrom,
  reportingTimeTo,
  bidSettingsInfo,
  bidDateTime
) => {
  const date = dayjs(reportingFrom);
  const dateTo = dayjs(reportingTimeTo);
  const bid = dayjs(bidDateTime);
  console.log("date", date);
  console.log("material", data.materialType);
  let url = "/shipper/load/";
  console.log("datataa", addressvalues);
  console.log(data);
  const payload = {
    bl_shipper_id:
      localStorage.getItem("user_type") === "acu"
        ? data.shipper
        : localStorage.getItem("user_id"),

    bl_region_cluster_id:
      data.region && data.region != "null" ? data.region : null,

    bl_branch_id: data.branch && data.branch != "null" ? data.branch : null,
    load_type: "reverse",
    bid_mode: data.bidType,
    show_current_lowest_rate_transporter:
      bidSettingsInfo.show_current_lowest_rate_transporter,
    bid_price_decrement: bidSettingsInfo.bid_price_decrement,
    indent_amount: data.indent_amount ? data.indent_amount : null,
    indent_transporter_id: data.indent_transporter_id
      ? data.indent_transporter_id
      : null,
    no_of_tries: bidSettingsInfo.no_of_tries,
    loading_contact_name: data.loadingContactName,
    bl_segment_id: data.segment && data.segment != "null" ? data.segment : null,
    loading_contact_no: data.loadingContactNumber,
    unloading_contact_name: data.unloadingContactPerson,
    unloading_contact_no: data.unloadingContactNumber,
    bid_time: bid.format("YYYY-MM-DD HH:mm:ss.SSS"),
    net_qty: data.totalLoad && data.totalLoad != "null" ? data.totalLoad : null,
    fleet_type: data.vehicleType,
    no_of_fleets: data.noOfVehicle,
    reporting_from_time: date.format("YYYY-MM-DD HH:mm:ss.SSS"),
    reporting_to_time: dateTo.format("YYYY-MM-DD HH:mm:ss.SSS"),
    comments: data.comment,
    // requirements_from_transporter:
    // load_status: "not_started",
    base_price: data.basePrice > 0 ? data.basePrice : 0,
    is_published: false,
    bid_duration: bidSettingsInfo.bid_duration,
    rate_quote_type: bidSettingsInfo.bdsttng_rate_quote_type,
    is_decrement_in_percentage: bidSettingsInfo.is_decrement_in_percentage,

    materials: data.materialType.map((value, index) => {
      return {
        mlm_material_id: value,
      };
    }),

    // materials: data.materialType.map((value) => {
    //   return {
    //     mlm_material_id: value.id,
    //   };
    // }),

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

export const UpdateBid = (
  data,
  address,
  reportingTimeFrom,
  reportingTimeTo,
  bidDateTime,
  loadId,
  status,
  addressValues
) => {
  let url = `/shipper/load/${loadId}`;
  reportingTimeFrom = dayjs(reportingTimeFrom);
  reportingTimeTo = dayjs(reportingTimeTo);
  bidDateTime = dayjs(bidDateTime);
  const updatedData = {
    bl_shipper_id:
      localStorage.getItem("user_type") === "acu"
        ? data.shipper
        : localStorage.getItem("user_id"),

    bl_region_cluster_id:
      data.region && data.region != "null" ? data.region : null,

    bl_branch_id: data.branch && data.branch != "null" ? data.branch : null,
    loading_contact_name: data.loadingContactName,
    indent_amount: data.indent_amount ? data.indent_amount : null,
    indent_transporter_id: data.indent_transporter_id
      ? data.indent_transporter_id
      : null,
    loading_contact_no: data.loadingContactNumber,
    unloading_contact_name: data.unloadingContactPerson,
    unloading_contact_no: data.unloadingContactNumber,
    bid_time: bidDateTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
    bid_mode: data.bidType,
    bl_segment_id: data.segment && data.segment != "null" ? data.segment : null,
    net_qty: data.totalLoad && data.totalLoad != "null" ? data.totalLoad : 0,
    fleet_type: data.vehicleType,
    no_of_fleets: data.noOfVehicle,
    reporting_from_time: reportingTimeFrom.format("YYYY-MM-DD HH:mm:ss.SSS"),
    reporting_to_time: reportingTimeTo.format("YYYY-MM-DD HH:mm:ss.SSS"),
    comments: data.comment,
    base_price: data.basePrice > 0 ? data.basePrice : 0,
    load_status: status,
    materials: data.materialType.map((val) => ({
      mlm_material_id: val,
    })),
    src_dest: addressValues.map((value, index) => {
      // console.log("here street address ", value.load_source.src_street_address);
      return {
        src_street_address: value.load_source.src_city,
        src_city: value.load_source.src_city,
        src_state: value.load_source.src_state,
        src_postal_code: value.load_source.src_postal_code,
        src_country: value.load_source.src_country,
        src_lat: value.load_source.lat,
        src_long: value.load_source.lng,
        dest_street_address: value.load_dest.src_city,
        dest_city: value.load_dest.src_city,
        dest_state: value.load_dest.src_state,
        dest_postal_code: value.load_dest.src_postal_code,
        dest_country: value.load_dest.src_country,
        dest_lat: value.load_dest.lat,
        dest_long: value.load_dest.lng,
        is_prime: value.is_prime,
      };
    }),
  };
  console.log("data in api", updatedData);
  return instance.patch(url, updatedData);
};
export const publishBid = (data) => {
  let url = "/shipper/load/publish";
  return instance.post(url, data);
};

export const PatchBid = (loadId) => {
  let url = `/shipper/load/${loadId}`;
  const statusUpdated = {
    load_status: "cancelled",
    rebid: true,
  };
  return instance.patch(url, statusUpdated);
};

export const reBidCreate = (
  loadId,
  data,

  addressvalues,
  // value,
  reportingFrom,
  reportingTimeTo,
  bidSettingsInfo,
  bidDateTime
) => {
  const date = dayjs(reportingFrom);
  const dateTo = dayjs(reportingTimeTo);
  const bid = dayjs(bidDateTime);
  console.log("date", date);

  let url = `/shipper/load/${loadId}/rebid`;
  console.log("datataa", addressvalues);
  const payload = {
    bid_time: bid.format("YYYY-MM-DD HH:mm:ss.SSS"),
    reporting_from_time: date.format("YYYY-MM-DD HH:mm:ss.SSS"),
    reporting_to_time: dateTo.format("YYYY-MM-DD HH:mm:ss.SSS"),
    reason: data.rebidcomment,

    materials: data.materialType.map((value, index) => {
      return {
        mlm_material_id: value,
      };
    }),

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

export const viewSpecificBranch = (branchId) => {
  let url = `/shipper/branch/${branchId}`;
  return instance.get(url);
};
