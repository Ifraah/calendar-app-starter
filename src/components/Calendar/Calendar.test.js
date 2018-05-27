import React from "react"
import { mount } from "enzyme"
import moment from "moment"
import Calendar from "."

describe("Calendar", () => {
  let component

  beforeEach(() => {
    component = mount(
      <Calendar
        startDate={moment("2017-01-01")}
        endDate={moment("2017-01-07")}
      />
    )
  })

  it("shows the current dates", () => {
    expect(component.find(".current-start")).toHaveText("1/1/2017")
    expect(component.find(".current-end")).toHaveText("1/7/2017")
  })

  it("switches current dates when you click a new start and end date", () => {
    component
      .find('button[children="8"]')
      .at(1)
      .simulate("click")
    component
      .find('button[children="14"]')
      .at(1)
      .simulate("click")
    expect(component.find(".current-start")).toHaveText("12/8/2016")
    expect(component.find(".current-end")).toHaveText("12/14/2016")
  })
})
