var Calendar = React.createClass({
    displayName: 'Calendar',

    calc: function (year, month) {
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    componentDidMount: function () {},
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

        numberofCalendars = maxDate.getMonth() - minDate.getMonth() + 1;
        console.log(12 % 11);

        var rows = [];
        for (var i = 0; i < numberofCalendars; i++) {
            rows.push(i);
        }

        return React.createElement(
            'div',
            null,
            rows.map(item => React.createElement(
                'div',
                { className: 'r-calendar' },
                React.createElement(
                    'div',
                    { className: 'r-inner' },
                    React.createElement(Header, { monthNames: this.state.monthNamesFull, month: this.state.month + item, year: this.state.year }),
                    React.createElement(WeekDays, { dayNames: this.state.dayNames, startDay: this.state.startDay, weekNumbers: this.state.weekNumbers }),
                    React.createElement(MonthDates, { month: this.state.month + item, year: this.state.year, daysInMonth: this.state.daysInMonth, firstOfMonth: this.state.firstOfMonth, startDay: this.state.startDay, onSelect: this.selectDate, weekNumbers: this.state.weekNumbers, disablePast: this.state.disablePast, minDate: this.state.minDate, maxDate: this.state.maxDate })
                )
            ))
        );
    }
});

var Header = React.createClass({
    displayName: 'Header',

    render: function () {
        return React.createElement(
            'div',
            { className: 'r-row r-head' },
            React.createElement(
                'div',
                { className: 'r-cell r-title' },
                this.props.monthNames[this.props.month],
                '\xA0',
                this.props.year
            )
        );
    }
});

var WeekDays = React.createClass({
    displayName: 'WeekDays',

    render: function () {
        var that = this,
            haystack = Array.apply(null, { length: 7 }).map(Number.call, Number);
        return React.createElement(
            'div',
            { className: 'r-row r-weekdays' },
            (() => {
                if (that.props.weekNumbers) {
                    return React.createElement(
                        'div',
                        { className: 'r-cell r-weeknum' },
                        'wn'
                    );
                }
            })(),
            haystack.map(function (item, i) {
                return React.createElement(
                    'div',
                    { className: 'r-cell' },
                    that.props.dayNames[(that.props.startDay + i) % 7]
                );
            })
        );
    }
});

var MonthDates = React.createClass({
    displayName: 'MonthDates',

    statics: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    render: function () {
        var haystack,
            day,
            d,
            current,
            onClick,
            isDate,
            className,
            weekStack = Array.apply(null, { length: 7 }).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        if (startDay == 5 && this.props.daysInMonth == 31 || startDay == 6 && this.props.daysInMonth > 29) {
            rows = 6;
        }

        className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
        haystack = Array.apply(null, { length: rows }).map(Number.call, Number);
        day = this.props.startDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        return React.createElement(
            'div',
            { className: className },
            haystack.map(function (item, i) {
                d = day + i * 7;
                return React.createElement(
                    'div',
                    { className: 'r-row' },
                    (() => {

                        if (that.props.weekNumbers) {
                            var wn = Math.ceil(((new Date(that.props.year, that.props.month, d) - janOne) / 86400000 + janOne.getDay() + 1) / 7);
                            return React.createElement(
                                'div',
                                { className: 'r-cell r-weeknum' },
                                wn
                            );
                        }
                    })(),
                    weekStack.map(function (item, i) {

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
                                return React.createElement('div', { className: className, role: 'button', tabIndex: '0' });
                            }
                            if (current.getDay() == 0 || current.getDay() == 6) {
                                className += ' r-weekend';
                            } else {
                                className += ' r-weekday';
                            }

                            return React.createElement(
                                'div',
                                { className: className, role: 'button', tabIndex: '0' },
                                d
                            );
                        }

                        return React.createElement('div', { className: 'r-cell' });
                    })
                );
            })
        );
    }
});

ReactDOM.render(React.createElement(Calendar, {
    minDate: new Date(2017, 10, 10),
    maxDate: new Date(2017, 11, 25)
}), document.getElementById("calendar"));