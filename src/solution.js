import { FILTER_YEAR, FILTER_CUSTOMERS } from "./constants";

const getPayload = (rocket) => rocket.second_stage.payloads;

const getPayloadWithCheck = (rocket) => {
  // could have used optionalChaining here but it was not enabled in babel config
  if (rocket && rocket.second_stage && rocket.second_stage.payloads) {
    return getPayload(rocket);
  }
  return [];
};

const filterByYear = (launch_year) => launch_year === FILTER_YEAR;

const filterByCustomer = (rocket) => {
  const rocketPayload = getPayloadWithCheck(rocket);

  return rocketPayload.some(({ customers }) => {
    if (customers) {
      return customers.some((customer) => FILTER_CUSTOMERS.includes(customer));
    }
    return false;
  });
};

const sortByLaunchDateAndPayloadQuantity = (launches) =>
  launches.sort(
    (
      { launch_date_utc: firstDateUTC, rocket: firstRocket },
      { launch_date_utc: secondDateUTC, rocket: secondRocket }
    ) => {
      const firstPayloadLength = getPayload(firstRocket).length;

      const secondPayloadLength = getPayload(secondRocket).length;

      if (firstPayloadLength === secondPayloadLength) {
        // it wasn't clear from Readme.md that data should be sorted on
        // inverse chronological order of which field (flight_number maybe?) so assuming UTC date here
        return new Date(secondDateUTC) - new Date(firstDateUTC);
      }

      return secondPayloadLength - firstPayloadLength;
    }
  );

const mapData = (launches) =>
  launches.map(({ flight_number, mission_name, rocket }) => {
    return {
      flight_number,
      mission_name,
      payloads_count: getPayload(rocket).length,
    };
  });

const prepareData = (launches) => {
  const filteredByYearAndCustomers = launches.filter(
    ({ launch_year, rocket }) =>
      filterByYear(launch_year) && filterByCustomer(rocket)
  );

  const sortedData = sortByLaunchDateAndPayloadQuantity(
    filteredByYearAndCustomers
  );

  const mappedData = mapData(sortedData);

  return mappedData;
};

const renderData = (launches) => {
  document.getElementById("out").innerHTML = JSON.stringify(launches, null, 2);
};

module.exports = {
  prepareData,
  renderData,
};
