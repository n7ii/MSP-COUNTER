import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/form/Input.tsx";
import { Button, Switch } from "@heroui/react";

interface TxnTypeFormProps {
    initialValues: {
        code: string;
        nameEn: string;
        nameLa: string;
        status: boolean;
    };
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

const TxnTypeForm: React.FC<TxnTypeFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const validationSchema = Yup.object().shape({
        code: Yup.string().required("Code is required"),
        nameEn: Yup.string().required("Name (EN) is required"),
        nameLa: Yup.string().required("Name (LA) is required"),
        status: Yup.boolean(),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex py-6 flex-col gap-4">
                <div>
                    <label htmlFor="code">Code</label>
                    <Input
                        id="code"
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Code"
                        className="mt-1"
                    />
                    {formik.touched.code && formik.errors.code && (
                        <div className="text-red-500">{formik.errors.code}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="nameEn">Name (EN)</label>
                    <Input
                        id="nameEn"
                        name="nameEn"
                        value={formik.values.nameEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Name (EN)"
                        className="mt-1"
                    />
                    {formik.touched.nameEn && formik.errors.nameEn && (
                        <div className="text-red-500">{formik.errors.nameEn}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="nameLa">Name (LA)</label>
                    <Input
                        id="nameLa"
                        name="nameLa"
                        value={formik.values.nameLa}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Name (LA)"
                        className="mt-1"
                    />
                    {formik.touched.nameLa && formik.errors.nameLa && (
                        <div className="text-red-500">{formik.errors.nameLa}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="status" className="pr-2">Status</label>
                    <Switch
                        id="status"
                        name="status"
                        defaultSelected={formik.values.status}
                        onChange={(e) =>
                            formik.setFieldValue("status", e.target.checked)
                        }
                        aria-label="Status"
                    />
                </div>
                <div className="flex gap-4">
                    <Button color="primary" className="w-full" type="submit">
                        Save
                    </Button>
                    <Button color="default" className="w-full" onPress={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TxnTypeForm;
