(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {}

 .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  .date-label {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
  .date-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .date-info > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .date-info-label {
    font-size: 18px;
    margin-bottom: 5px;
color:#eb4034;
  }
  .date-info-value {
    font-size: 24px;
    font-weight: bold;
  }
    </style>
<div class="container">
  <div class="date-info">
<div>
      <div class="date-info-value"><span id="date"></span></div>
      <div class="date-info-label">Date</div>
    </div>
    <div>
      <div class="date-info-value"><span id="month"></span></div>
      <div class="date-info-label">Month</div>
    </div>
    <div>
      <div class="date-info-value"><span id="year"></span></div>
      <div class="date-info-label">Year</div>
    </div>
    <div>
      <div class="date-info-value"><span id="quarter"></span></div>
      <div class="date-info-label">Quarter</div>
    </div>
    <div>
      <div class="date-info-value"><span id="week"></span></div>
      <div class="date-info-label">Week</div>
    </div>
    <div>
      <div class="date-info-value"><span id="day"></span></div>
      <div class="date-info-label">Day</div>
    </div>
  </div>
</div>
  `;
  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }
    async connectedCallback() {
      this.initMain();
    }
    async initMain() {
      const mydate = this._props.date || "2023-03-09";
      const date = new Date(mydate);

      this.updateDateInfo(date);
      const boxcolor = this._props.boxcolor;
      const divs = this.shadowRoot.querySelectorAll(".date-info > div");
      divs.forEach(div => {
        div.style.backgroundColor = boxcolor;
      });
    }
    updateDateInfo(date) {

      const year = date.getFullYear();
      const month = date.toLocaleString("default", {
        month: "long"
      });
      const quarter = `Q${Math.floor((date.getMonth() + 3) / 3)}`;
      const day = date.toLocaleString("default", {
        weekday: "long"
      });
      const week = `W${this.getWeekNumber(date)}`;
      const the_date = `${date.getDate()}`;
      this.shadowRoot.getElementById("year").textContent = year;
      this.shadowRoot.getElementById("month").textContent = month;
      this.shadowRoot.getElementById("quarter").textContent = quarter;
      this.shadowRoot.getElementById("day").textContent = day;
      this.shadowRoot.getElementById("week").textContent = week;
      this.shadowRoot.getElementById("date").textContent = the_date;

      this.setValues(year, month, quarter, day, week, the_date);
    }
    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }
    onCustomWidgetAfterUpdate(changedProperties) {
      if ("date" in changedProperties) {
        const date = new Date(this._props.date);
        this.updateDateInfo(date);
      }
    }
    // Function to get the week number from a date
    getWeekNumber(date) {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const daysSinceFirstDayOfYear = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
      return Math.ceil((firstDayOfYear.getDay() + daysSinceFirstDayOfYear + 1) / 7);
    }
    setValues(_year, _month, _quarter, _day, _week, _the_date) {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            year: _year,
            month: _month,
            quarter: _quarter,
            day: _day,
            week: _week,
            dateof: _the_date,
          }
        }
      }));
    }
  }
  customElements.define("com-rohitchouhan-sap-quickdatewidget", Widget);
})();