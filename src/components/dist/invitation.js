import {React} from 'react'

"use strict";
exports.__esModule = true;
var table_layout_component_1 = require("@/components/Table/table-layout.component");
var Table_component_1 = require("@/components/Table/Table.component");
var status_chip_component_1 = require("../../src/components/StatusChip/status-chip.component");
var KebabMenu_component_1 = require("../../src/components/KebabMenu/KebabMenu.component");
var withPermission_1 = require("src/helpers/HOC/withPermission");
var InvitationTab = function () {
    var KebabWithPermissions = withPermission_1["default"](KebabMenu_component_1.KebabMenu, ['Employee', 'write']);
    // useEffect(() => {
    //   const ids = employees.map((employee) => employee.id);
    //   setSelected((i) => i.filter((s) => ids.includes(s)));
    // }, [employees]);
    return (React.createElement("div", null,
        React.createElement(table_layout_component_1.TableLayout, null,
            React.createElement(Table_component_1.TableV2, null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Organization"),
                        React.createElement("th", null, "Role"),
                        React.createElement("th", null, "Email Adress"),
                        React.createElement("th", null, "Phone Number"),
                        React.createElement("th", null, "Country"),
                        React.createElement("th", null, "Status"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("span", { className: "identity" },
                                React.createElement("span", { className: "identity__initial" }, "c"),
                                React.createElement("span", { className: "" }, "christechnology"))),
                        React.createElement("td", null, "owner"),
                        React.createElement("td", null, "kolajoelizabeth@gmail.com"),
                        React.createElement("td", null, "0708 888 2202"),
                        React.createElement("td", null, "Nigeria"),
                        React.createElement("td", null,
                            React.createElement("span", { className: "d-flex justify-content-space-between align-items-center" },
                                React.createElement(status_chip_component_1.StatusChip, { status: "successful" }),
                                React.createElement(KebabWithPermissions, { items: [
                                        {
                                            value: "accept"
                                        },
                                        {
                                            value: "decline"
                                        },
                                        {
                                            value: "delete"
                                        },
                                    ] })))))))));
};
exports["default"] = InvitationTab;
