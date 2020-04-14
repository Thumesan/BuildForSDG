
function calculateInfectionsByRequestedTime(currentlyInfected, periodType, timeToElapse) {
  let time;


  switch (periodType) {
    case 'days':
      time = Math.trunc(timeToElapse / 3);
      break;
    case 'weeks':
      time = timeToElapse * 7; // bring weeks to days
      time = Math.trunc(time / 3);
      break;
    case 'months':
      time = timeToElapse * 30; // bring months to days
      time = Math.trunc(time / 3);
      break;
    default:
      break;
  }

  const infectedByTime = currentlyInfected * (2 ** time);
  return infectedByTime;
}

function calculateSevereCasesByRequestedTime(infectionsByRequestedTime) {
  const severeCasesByRequestedTime = infectionsByRequestedTime * 0.15;
  return severeCasesByRequestedTime;
}

function determineNumberOfAvailableBeds(severeCasesByRequestedTime, totalHospitalBeds) {
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;
  return hospitalBedsByRequestedTime;
}

function calcDollarsInFlight(data, infectionsByRequestedTime) {
  const dollarsInFlight = (infectionsByRequestedTime * data.avgDailyIncomePopulation * data.avgDailyIncomeInUSD) / 30;
  return Math.trunc(dollarsInFlight);
}

function calculateImpact(data) {
  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = calculateInfectionsByRequestedTime(currentlyInfected, data.periodType, data.timeToElapse);
  const severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = determineNumberOfAvailableBeds(severeCasesByRequestedTime, data.totalHospitalBeds);
  const dollarsInFlight = calcDollarsInFlight(data, infectionsByRequestedTime);
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    dollarsInFlight
  };
}

function calculateSeverImpact(data) {
  const currentlyInfected = data.reportedCases * 50;
  const infectionsByRequestedTime = calculateInfectionsByRequestedTime(currentlyInfected, data.periodType, data.timeToElapse);
  const severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = determineNumberOfAvailableBeds(severeCasesByRequestedTime, data.totalHospitalBeds);
  const dollarsInFlight = calcDollarsInFlight(data, infectionsByRequestedTime);
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    dollarsInFlight
  };
}


const challengesOutput = (data) => {
  const impactCalc = calculateImpact(data);
  const severImpactCalc = calculateSeverImpact(data);
  return {
    data, // the input data you got
    impact: {
      currentlyInfected: impactCalc.currentlyInfected,
      infectionsByRequestedTime: impactCalc.infectionsByRequestedTime,
      severeCasesByRequestedTime: impactCalc.severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: impactCalc.hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: Math.trunc(impactCalc.infectionsByRequestedTime * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(impactCalc.infectionsByRequestedTime * 0.02),
      dollarsInFlight: impactCalc.dollarsInFlight
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: severImpactCalc.currentlyInfected,
      infectionsByRequestedTime: severImpactCalc.infectionsByRequestedTime,
      severeCasesByRequestedTime: severImpactCalc.severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: severImpactCalc.hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: Math.trunc(severImpactCalc.infectionsByRequestedTime * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(severImpactCalc.infectionsByRequestedTime * 0.02),
      dollarsInFlight: severImpactCalc.dollarsInFlight
    } // your severe case estimation
  };
};

export default challengesOutput;
