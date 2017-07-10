var Calendar = React.createClass({
    calc: function (year, month) {
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    componentDidMount: function () {

    },
    getInitialState: function () {
        var date = new Date();
        return {
            year: this.props.minDate.getFullYear(),
            month: this.props.minDate.getMonth(),
            startDay: 0,
            weekNumbers: false,
            minDate: this.props.minDate ? this.props.minDate : null,
            maxDate: this.props.maxDate ? this.props.maxDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null
        };
    },
    render: function () {
      var minDate = this.state.minDate;
      var maxDate = this.state.maxDate;
      var months;

      months = (maxDate.getFullYear() - minDate.getFullYear()) * 12;
      months -= minDate.getMonth() + 1;
      months += maxDate.getMonth();
      numberofCalendars = months + 2;

      var rows = [];
      for (var i=0; i < numberofCalendars; i++) {
        rows.push({
          value:i,
          nextyear:1
        });
      }

        return (
          <div>
            {rows.map(item => {
              var firstOfMonth = new Date(this.state.year, this.state.month+item.value, 1);
              var daysInMonth = new Date(this.state.year, this.state.month+item.value + 1, 0).getDate()
              console.log(firstOfMonth.getMonth());
              return(
                <div className="r-calendar">
                  <div className="r-inner">
                    <Header monthNames={this.state.monthNamesFull} month={firstOfMonth.getMonth()} year={firstOfMonth.getFullYear()} />
                    <WeekDays dayNames={this.state.dayNames} startDay={this.state.startDay} weekNumbers={this.state.weekNumbers} />
                    <MonthDates month={this.state.month+item.value} year={this.state.year} daysInMonth={daysInMonth} firstOfMonth={firstOfMonth} startDay={this.state.startDay} onSelect={this.selectDate} weekNumbers={this.state.weekNumbers} disablePast={this.state.disablePast} minDate={this.state.minDate} maxDate={this.state.maxDate} />
                  </div>
                </div>
              );
            })

            }
            </div>
        );

    }
});

var Header = React.createClass({
    render: function () {
        return (
            <div className="r-row r-head">
              <div className="r-cell r-title">{this.props.monthNames[this.props.month]}&nbsp;{this.props.year}</div>
            </div>
        );
    }
});

var WeekDays = React.createClass({
    render: function () {
        var that = this,
            haystack = Array.apply(null, {length: 7}).map(Number.call, Number);
        return (
            <div className="r-row r-weekdays">
              {(() => {
                if (that.props.weekNumbers) {
                  return (
                    <div className="r-cell r-weeknum">wn</div>
                  );
                }
              })()}
              {haystack.map(function (item, i) {
                return (
                  <div className="r-cell">{that.props.dayNames[(that.props.startDay + i) % 7]}</div>
                );
                })}
            </div>
        );
    }
});

var MonthDates = React.createClass({
    statics: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    render: function () {
        var haystack, day, d, current, onClick,
            isDate, className,
            weekStack = Array.apply(null, {length: 7}).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        if ((startDay == 5 && this.props.daysInMonth == 31) || (startDay == 6 && this.props.daysInMonth > 29)) {
            rows = 6;
        }

        className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
        haystack = Array.apply(null, {length: rows}).map(Number.call, Number);
        day = this.props.startDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        return (
            <div className={className}>
              {haystack.map(function (item, i) {
                d = day + i * 7;
                return (
                  <div className="r-row">
                    {(() => {

                      if (that.props.weekNumbers) {
                        var wn = Math.ceil((((new Date(that.props.year, that.props.month, d) - janOne) / 86400000) + janOne.getDay() + 1) / 7);
                        return (
                          <div className="r-cell r-weeknum">{wn}</div>
                        );
                      }
                    })()}
                    {weekStack.map(function (item, i) {

                        d += 1;
                        isDate = d > 0 && d <= that.props.daysInMonth;

                      if (isDate) {
                        current = new Date(that.props.year, that.props.month, d);

                        className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';
                        if (that.props.disablePast && current < that.constructor.today) {
                          className += ' r-past';
                        } else if (that.props.minDate !== null && current < that.props.minDate) {
                          className += ' r-past';
                        }
                        if (that.props.maxDate !== null && current > that.props.maxDate) {
                          className += ' r-future';
                        }

                        if (/r-past/.test(className) || /r-future/.test(className)) {
                          return (
                            <div className={className} role="button" tabIndex="0"></div>
                          );
                        }
                        if (current.getDay() == 0 || current.getDay()== 6){
                          className += ' r-weekend';
                        }else{
                          className += ' r-weekday';
                        }

                        return (
                          <div className={className} role="button" tabIndex="0">{d}</div>
                        );
                      }

                      return (
                        <div className="r-cell r-disabled"></div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
        );
    }
});

ReactDOM.render(
    React.createElement(Calendar, {
      minDate: new Date(2017, 11, 10),
      maxDate: new Date(2019, 1, 25),
    }),
    document.getElementById("calendar")
);
