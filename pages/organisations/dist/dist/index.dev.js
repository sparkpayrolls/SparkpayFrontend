"use strict";

var _react = require("react");

"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var head_1 = require("next/head");

var DashBoardLayout_1 = require("../../src/layouts/dashboard-layout/DashBoardLayout");

var organization_table_1 = require("@/components/Table/organization-table");

var react_1 = require("react");

var util_1 = require("src/helpers/util");

var api_1 = require("src/api");

var react_toastify_1 = require("react-toastify");

var withAuth_1 = require("src/helpers/HOC/withAuth");

var create_organisation_button_component_1 = require("@/components/Button/create-organisation-button.component");

var hooks_1 = require("src/redux/hooks");

var companies_slice_1 = require("src/redux/slices/companies/companies.slice");

require("antd/dist/antd.css");

var antd_1 = require("antd");

var invitation_1 = require("../../src/components/invitation");

var TabPane = antd_1.Tabs.TabPane;

function callback(key) {
  console.log(key);
}

var OrganizationSettings = function OrganizationSettings() {
  var _a = react_1.useState(false),
      loading = _a[0],
      setLoading = _a[1];

  var _b = react_1.useState({
    data: [],
    meta: util_1.Util.getDefaultPaginationMeta({})
  }),
      _c = _b[0],
      data = _c.data,
      meta = _c.meta,
      setData = _b[1];

  var _d = react_1.useState({}),
      query = _d[0],
      setQuery = _d[1];

  var dispatch = hooks_1.useAppDispatch();
  var getOrganizations = react_1.useCallback(function (query) {
    return __awaiter(void 0, void 0, void 0, function () {
      var res_1, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            _a.label = 1;

          case 1:
            _a.trys.push([1, 3, 4, 5]);

            setQuery(query);
            return [4
            /*yield*/
            , api_1.$api.company.getCompaniesPaginated(query)];

          case 2:
            res_1 = _a.sent();
            setData(function (i) {
              return res_1;
            });
            return [3
            /*break*/
            , 5];

          case 3:
            error_1 = _a.sent();
            return [3
            /*break*/
            , 5];

          case 4:
            setLoading(false);
            return [7
            /*endfinally*/
            ];

          case 5:
            return [2
            /*return*/
            ];
        }
      });
    });
  }, [setLoading, setData, setQuery]);

  var deleteOrganization = function deleteOrganization(id) {
    return __awaiter(void 0, void 0, void 0, function () {
      var clone, error_2, err;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (loading) return [3
            /*break*/
            , 5];
            setLoading(true);
            clone = data.map(function (d) {
              return __assign({}, d);
            });
            _a.label = 1;

          case 1:
            _a.trys.push([1, 3, 4, 5]);

            setData({
              meta: meta,
              data: data.filter(function (d) {
                return d.company.id !== id;
              })
            });
            return [4
            /*yield*/
            , api_1.$api.company.deleteCompany(id)];

          case 2:
            _a.sent();

            getOrganizations(query);
            companies_slice_1.refreshCompanies(dispatch);
            react_toastify_1.toast.success('company deleted successfully');
            return [3
            /*break*/
            , 5];

          case 3:
            error_2 = _a.sent();
            err = error_2;
            react_toastify_1.toast.error(err.message);
            setData({
              meta: meta,
              data: clone
            });
            return [3
            /*break*/
            , 5];

          case 4:
            setLoading(false);
            return [7
            /*endfinally*/
            ];

          case 5:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  react_1.useEffect(function () {
    getOrganizations({});
  }, [getOrganizations]);
  return _react.React.createElement(_react.React.Fragment, null, _react.React.createElement(DashBoardLayout_1["default"], {
    pageTitle: "Organisations"
  }, _react.React.createElement("div", {
    className: "organisation"
  }, _react.React.createElement(head_1["default"], null, _react.React.createElement("title", null, "Organisations")), _react.React.createElement("div", {
    className: "employee-section__head"
  }, _react.React.createElement("h1", {
    className: "employee-section__title"
  }, "Organisations"), _react.React.createElement("div", {
    className: "employee-section__employee-button"
  }, _react.React.createElement(create_organisation_button_component_1.CreateOrganisationButton, {
    onCreate: function onCreate() {
      return getOrganizations(query);
    }
  }))), _react.React.createElement(antd_1.Tabs, {
    defaultActiveKey: "1",
    onChange: callback
  }, _react.React.createElement(TabPane, {
    tab: "Organizations",
    key: "1"
  }, _react.React.createElement("div", {
    className: "organisation__table-section"
  }, _react.React.createElement(organization_table_1.OrganizationTable, {
    organizations: data,
    paginationMeta: meta,
    getOrganizations: getOrganizations,
    deleteOrganisation: deleteOrganization,
    loading: loading
  }))), _react.React.createElement(TabPane, {
    tab: "Invitations",
    key: "2"
  }, _react.React.createElement(invitation_1["default"], null))))));
};

exports["default"] = withAuth_1["default"](OrganizationSettings);