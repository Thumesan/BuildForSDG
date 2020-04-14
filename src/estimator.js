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
  return Math.trunc(severeCasesByRequestedTime);
}

function NumberOfAvailableBeds(severeCasesByRequestedTime, totalHospitalBeds) {
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;
  return Math.trunc(hospitalBedsByRequestedTime);
}

function calcDollarsInFlight(data, infectionsByRequestedTime) {
  const dailyIncome = Math.trunc(data.avgDailyIncomeInUSD);
  const incomePop = Math.trunc(data.avgDailyIncomePopulation);
  const multiply = infectionsByRequestedTime * incomePop * dailyIncome;
  const dollarsInFlight = Math.trunc(multiply / 30);
  return dollarsInFlight;
}

function calculateImpact(data) {
  const currentlyInfected = data.reportedCases * 10;
  const pt = data.periodType;// reduced chars as eslint suggested too long
  const tte = data.timeToElapse;// reduced chars as eslint suggested too long
  const thb = data.totalHospitalBeds;
  const infectionsByRequestedTime = calculateInfectionsByRequestedTime(currentlyInfected, pt, tte);
  const severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = NumberOfAvailableBeds(severeCasesByRequestedTime, thb);
  const dollarsInFlight = calcDollarsInFlight(data, infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    dollarsInFlight,
    casesForVentilatorsByRequestedTime
  };
}

function calculateSeverImpact(data) {
  const currentlyInfected = data.reportedCases * 50;
  const pt = data.periodType;
  const tte = data.timeToElapse;
  const thb = data.totalHospitalBeds;
  const infectionsByRequestedTime = calculateInfectionsByRequestedTime(currentlyInfected, pt, tte);
  const severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = NumberOfAvailableBeds(severeCasesByRequestedTime, thb);
  const dollarsInFlight = calcDollarsInFlight(data, infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    dollarsInFlight,
    casesForVentilatorsByRequestedTime
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
      casesForVentilatorsByRequestedTime: impactCalc.casesForVentilatorsByRequestedTime,
      dollarsInFlight: impactCalc.dollarsInFlight
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: severImpactCalc.currentlyInfected,
      infectionsByRequestedTime: severImpactCalc.infectionsByRequestedTime,
      severeCasesByRequestedTime: severImpactCalc.severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: severImpactCalc.hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: Math.trunc(severImpactCalc.infectionsByRequestedTime * 0.05),
      casesForVentilatorsByRequestedTime: severImpactCalc.casesForVentilatorsByRequestedTime,
      dollarsInFlight: severImpactCalc.dollarsInFlight
    } // your severe case estimation
  };
};

const covid19ImpactEstimator = (data) => {
  const output = challengesOutput(data);
  return output;
};

export default covid19ImpactEstimator;
