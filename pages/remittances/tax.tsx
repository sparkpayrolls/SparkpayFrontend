import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Image from 'next/image';
import { Radio } from 'antd';
import backicon from '../../public/svgs/back-icon.svg';
import Link from 'next/link';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import { Input } from '../../src/components/Input/Input.component';
import { Formik, FormikProps } from 'formik';
import { TaxInformationValidationSchema } from 'src/helpers/validation';
import { TaxCalculation } from '../../src/components/types';
import { Select } from '@/components/Input/select.component';


const { TabPane } = Tabs;

function callback(key: any) {
    console.log(key);
}
const Tax: NextPage = () => {
    return (
        <DashboardLayout pageTitle="remittances-tax">
            <div className="remittances-tax-page">
                <div className="remittances-tax-section">
                    <div className="group-details__header-content">
                        <div className="group-details__group-detail-title-section">
                            <Link href="/remittances">
                                <a>
                                    <Image
                                        src={backicon}
                                        alt="group-details-image"
                                        className="group-details__prev-icon"
                                    />
                                </a>
                            </Link>
                            <h5 className="group-details__group-detail-title">Tax</h5>
                        </div>
                        <Button
                            label={<>{'Proceed'}</>}
                            element="a"
                            className="payroll-section__submit-btn"
                            primary
                            type="submit"
                        />
                    </div>
                    <div className="remittances-tax-page__tax-section">

                        <Tabs defaultActiveKey="1" onChange={callback}>
                            <TabPane tab="Tax" key="1">
                                <div className="remittances-tax-page__remittances-tax-tab">
                                    <div className="remittances-tax-page__remittances-options-details">
                                        <div className="remittances-tax-page__remittances-options-group">
                                            <div className="remittances-tax-page__remittances-tax-header">
                                                <h2>Required Actions</h2>
                                                <p>You can only select one at a time</p>
                                            </div>
                                            <div className="remittances-tax-page__remittances-options">
                                                <Radio.Group name="uploadType">
                                                    <Radio value="Disable">Disable</Radio>
                                                    <br />
                                                    <Radio value="Calculate">Calculate</Radio>
                                                    <br />
                                                    <Radio value="Deduct">Deduct</Radio>
                                                    <br />
                                                    <Radio value="Remit">Remit</Radio>
                                                </Radio.Group>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="remittances-tax-page__General-information">
                                        <div className="remittances-tax-page__General-tax-header">
                                            <h2>General Info</h2>
                                            <p>Enter general info to calculate taxes</p>
                                        </div>
                                        <div className="user-profile__formik-section">
                                            <Formik
                                                initialValues={{
                                                    taxId: '',
                                                    state: '',
                                                    taxOfficeNumber: '',
                                                }}
                                                onSubmit={(values) => {
                                                    console.log(values);
                                                }}
                                                validationSchema={TaxInformationValidationSchema}
                                            >
                                                {(props: FormikProps<TaxCalculation>) => {
                                                    const {
                                                        values,
                                                        touched,
                                                        errors,
                                                        handleBlur,
                                                        handleChange,
                                                        handleSubmit,
                                                    } = props;
                                                    return (
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="remittances-tax-page__General-information-tax">
                                                                <div className="user-profile__form-input-area">
                                                                    <Input
                                                                        className="remittances-tax-page__input-width"
                                                                        type="text"
                                                                        label="Tax ID"
                                                                        placeholder="Tax ID"
                                                                        name="Tax ID"
                                                                        value={values.taxId}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        hasError={errors.taxId && touched.taxId}
                                                                        error={errors.taxId}
                                                                    />
                                                                    <Select
                                                                        showSearch
                                                                        label="Select state"
                                                                        className="remittances-tax-page__input-width"
                                                                        error={(touched.state && errors.state) || ''}
                                                                    >
                                                                    </Select>

                                                                    <Input
                                                                        className="remittances-tax-page__input-width"
                                                                        type="text"
                                                                        label="Tax Office Number"
                                                                        placeholder="Tax Office Number"
                                                                        name="Tax Office Number"
                                                                        value={values.taxOfficeNumber}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        hasError={errors.taxOfficeNumber && touched.taxOfficeNumber}
                                                                        error={errors.taxOfficeNumber}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </form>
                                                    );
                                                }}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>

                            </TabPane>
                            <TabPane tab="Tax Group" key="2">
                                Content of Tab Pane 2
                            </TabPane>

                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Tax;
