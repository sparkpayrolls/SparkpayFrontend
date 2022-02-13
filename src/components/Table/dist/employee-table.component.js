import {React} from 'react'


"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.EmployeeTable = void 0;
var react_1 = require("react");
var util_1 = require("src/helpers/util");
var withPermission_1 = require("src/helpers/HOC/withPermission");
var date_time_chip_1 = require("../DateTimeChip/date-time-chip");
var status_chip_component_1 = require("../StatusChip/status-chip.component");
var KebabMenu_component_1 = require("../KebabMenu/KebabMenu.component");
var Table_component_1 = require("./Table.component");
exports.EmployeeTable = function (props) {
    var employees = props.employees, paginationMeta = props.paginationMeta, getEmployees = props.getEmployees, onFilter = props.onFilter, loading = props.loading, onStatusToggle = props.onStatusToggle, onDelete = props.onDelete, administrator = props.administrator, onSendOnboardingLink = props.onSendOnboardingLink;
    var _a = react_1.useState([]), selected = _a[0], setSelected = _a[1];
    var allChecked = !!selected.length &&
        employees.every(function (employee) { return selected.includes(employee.id); });
    var currency = util_1.Util.getCurrencySymbolFromAdministrator(administrator);
    var hasWriteAccess = util_1.Util.canActivate([['Employee', 'write']], administrator);
    var kebabHandler = function (action) {
        switch (action) {
            case 'Activate':
            case 'Deactivate': {
                return onStatusToggle(action);
            }
            default:
                return onDelete;
        }
    };
    var onEmployeeSelect = function (id) {
        return function () {
            if (selected.includes(id)) {
                setSelected(selected.filter(function (sel) { return sel !== id; }));
                return;
            }
            setSelected(__spreadArrays(selected, [id]));
        };
    };
    var onCheckAll = function () {
        if (employees.every(function (e) { return selected.includes(e.id); })) {
            setSelected([]);
            return;
        }
        setSelected(employees.map(function (e) { return e.id; }));
    };
    var kebabMenu = hasWriteAccess
        ? [
            { action: function () { return kebabHandler('Delete')(selected); }, value: 'Delete' },
            {
                action: function () { return kebabHandler('Activate')(selected); },
                value: 'Activate'
            },
            {
                action: function () { return kebabHandler('Deactivate')(selected); },
                value: 'Deactivate'
            },
            {
                action: function () { return onSendOnboardingLink(selected); },
                value: 'Resend onboarding link'
            },
        ]
        : undefined;
    var employeeKebabMenu = function (id, status) {
        var menu = [
            {
                href: "/employees/" + id,
                value: 'View'
            },
        ];
        if (hasWriteAccess) {
            menu.push({
                action: function () { return kebabHandler('Delete')(id); },
                value: 'Delete'
            }, {
                action: function () {
                    return kebabHandler(status === 'active' ? 'Deactivate' : 'Activate')(id);
                },
                value: status === 'active' ? 'Deactivate' : 'Activate'
            }, {
                action: function () { return onSendOnboardingLink(id); },
                value: 'Resend onboarding link'
            });
        }
        return menu;
    };
    var KebabWithPermissions = withPermission_1["default"](KebabMenu_component_1.KebabMenu, ['Employee', 'write']);
    react_1.useEffect(function () {
        var ids = employees.map(function (employee) { return employee.id; });
        setSelected(function (i) { return i.filter(function (s) { return ids.includes(s); }); });
    }, [employees]);
    return (React.createElement("div", { className: "employee-table" },
        React.createElement(Table_component_1.Table, { headerRow: [
                'Name',
                'Email\xa0Address',
                "Amount",
                'Status',
                'Group',
                'Date\xa0Added',
            ], allChecked: allChecked, onCheckAllClick: onCheckAll, paginationMeta: paginationMeta, refresh: getEmployees, title: paginationMeta.total + "\u00A0Employee(s)", onFilterClick: onFilter, isEmpty: !employees.length, emptyStateText: "No employee yet", isLoading: loading, kebabMenuItems: kebabMenu }, function () {
            return (React.createElement("tbody", null, employees.map(function (employee) {
                return (React.createElement(Table_component_1.TR, { key: employee.id, checked: selected.includes(employee.id), onChange: onEmployeeSelect(employee.id) },
                    React.createElement("td", null,
                        employee.firstname,
                        " ",
                        employee.lastname),
                    React.createElement("td", null,
                        React.createElement("span", { className: "email", title: employee.email }, employee.email)),
                    React.createElement("td", null,
                        currency,
                        " ",
                        util_1.Util.formatMoneyNumber(employee.salary)),
                    React.createElement("td", null,
                        React.createElement(status_chip_component_1.StatusChip, { status: employee.status })),
                    React.createElement("td", null, employee.groups
                        .map(function (employeeGroup) { return employeeGroup.group.name; })
                        .join(', ')),
                    React.createElement("td", null,
                        React.createElement("span", { className: "d-flex justify-content-space-between align-items-center" },
                            React.createElement(date_time_chip_1.DateTimeChip, { date: employee.createdAt, dateFormat: 'MMM\xa0DD,\xa0YYYY' }),
                            React.createElement(KebabWithPermissions, { items: employeeKebabMenu(employee.id, employee.status) })))));
            })));
        })));
};
