"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var head_1 = require("next/head");
var DashBoardLayout_1 = require("../../src/layouts/dashboard-layout/DashBoardLayout");
var organization_table_1 = require("@/components/Table/organization-table");
var react_1 = require("react");
var util_1 = require("src/helpers/util");
var api_1 = require("src/api");
var withAuth_1 = require("src/helpers/HOC/withAuth");
var create_organisation_button_component_1 = require("@/components/Button/create-organisation-button.component");
var hooks_1 = require("src/redux/hooks");
require("antd/dist/antd.css");
var antd_1 = require("antd");
var invitation_1 = require("../../src/components/invitation");
var TabPane = antd_1.Tabs.TabPane;
function callback(key) {
    console.log(key);
}
var OrganizationSettings = function () {
    var _a = react_1.useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState(false), isModalVisible = _b[0], setIsModalVisible = _b[1];
    var _c = react_1.useState({
        data: [],
        meta: util_1.Util.getDefaultPaginationMeta({})
    }), _d = _c[0], data = _d.data, meta = _d.meta, setData = _c[1];
    var _e = react_1.useState({}), query = _e[0], setQuery = _e[1];
    var dispatch = hooks_1.useAppDispatch();
    var getOrganizations = react_1.useCallback(function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var res_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setQuery(query);
                    return [4 /*yield*/, api_1.$api.company.getCompaniesPaginated(query)];
                case 2:
                    res_1 = _a.sent();
                    setData(function (i) { return res_1; });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [setLoading, setData, setQuery]);
    var deleteOrganization = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            showModal();
            return [2 /*return*/];
        });
    }); };
    react_1.useEffect(function () {
        getOrganizations({});
    }, [getOrganizations]);
    var showModal = function () {
        setIsModalVisible(true);
    };
    var handleOk = function () {
        setIsModalVisible(false);
    };
    var handleCancel = function () {
        setIsModalVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(DashBoardLayout_1["default"], { pageTitle: "Organisations" },
            React.createElement("div", { className: "organisation" },
                React.createElement(head_1["default"], null,
                    React.createElement("title", null, "Organisations")),
                React.createElement("div", { className: "employee-section__head" },
                    React.createElement("h1", { className: "employee-section__title" }, "Organisations"),
                    React.createElement("div", { className: "employee-section__employee-button" },
                        React.createElement(create_organisation_button_component_1.CreateOrganisationButton, { onCreate: function () { return getOrganizations(query); } }))),
                React.createElement(antd_1.Tabs, { defaultActiveKey: "1", onChange: callback },
                    React.createElement(TabPane, { tab: "Organizations", key: "1" },
                        React.createElement("div", { className: "organisation__table-section" },
                            React.createElement(organization_table_1.OrganizationTable, { organizations: data, paginationMeta: meta, getOrganizations: getOrganizations, deleteOrganisation: deleteOrganization, loading: loading }))),
                    React.createElement(TabPane, { tab: "Invitations", key: "2" },
                        React.createElement(invitation_1["default"], null)))),
            React.createElement(antd_1.Modal, { title: "Warning", visible: isModalVisible, onOk: handleOk, onCancel: handleCancel },
                React.createElement("p", null, "Are you sure you want to delete this organization?")))));
};
exports["default"] = withAuth_1["default"](OrganizationSettings);
