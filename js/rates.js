// var options = {
//     chart: {
//       type: 'line'
//     },
//     series: [{
//       name: 'sales',
//       data: [30,40,35,50,49,60,70,91,125]
//     }],
//     xaxis: {
//       categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
//     }
//   }
  
//   var chart = new ApexCharts(document.querySelector("#currency-card__chart"), options);
  
//   chart.render();
//#6bdada
//#1DB954
var options = {
    series: [{
    name: "Rate"
    // data: [30,40,35,50,49,60,70,91,125]
  }],
    chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    }
  },
  colors: ['#6bdada'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Wykaz EURO na PLN',
    align: 'center',
    style: {
      fontSize: '21'
    },
    margin: 40,
  },
  subtitle: {
    text: 'Sprzed 1 miesiąca',
    align: 'center',
    style: {
      fontSize: '19'
    },
    margin: 40,
  },
  xaxis: {
    // categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999],
    type: 'datetime'
  },
  yaxis: {
    opposite: true,
  },
  legend: {
    horizontalAlign: 'left'
  }
  };

  var chart = new ApexCharts(document.querySelector("#rates__chart"), options);
  
  chart.render();

  