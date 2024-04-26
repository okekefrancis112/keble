import { Response } from "express";
import { ExpressRequest } from "../../server";
import { Types } from "mongoose";
import { getPercent, rate, throwIfUndefined } from "../../util";
import ResponseHandler from "../../util/response-handler";
import userRepository from "../../repositories/user.repository";
import planRepository from "../../repositories/portfolio.repository";
import { RATES } from "../../constants/rates.constant";
import { HTTP_CODES } from "../../constants/app_defaults.constant";

export async function createNumberStory(
    req: ExpressRequest,
    res: Response
): Promise<Response | void> {
    try {
        const { currency, month, investment } = req.body;

        const _return = rate(currency);

        const total_investment = Number(investment) * Number(month);
        const monthly_real = _return.real / 100 / 12;
        const monthly_stock = _return.stock / 100 / 12;
        const monthly_saving = _return.saving / 100 / 12;
        const int_real = (1 + monthly_real) ** Number(month) - 1;
        const int_stock = (1 + monthly_stock) ** Number(month) - 1;
        const int_saving = (1 + monthly_saving) ** Number(month) - 1;
        const expected_real: any = (investment * int_real) / monthly_real;
        const gains_real: any = expected_real - total_investment;
        const expected_stock: any = (investment * int_stock) / monthly_stock;
        const gains_stock: any = expected_stock - total_investment;
        const expected_savings: any =
            (investment * int_saving) / monthly_saving;
        const gains_savings: any = expected_savings - total_investment;

        return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: "Here is your has been successfully retrieved",
            data: {
                real_rate: _return.real,
                stock_rate: _return.stock,
                saving_rate: _return.saving,
                total_investment,
                expected_real,
                gains_real,
                expected_stock,
                gains_stock,
                expected_savings,
                gains_savings,
            },
        });
    } catch (error) {
        // If an error occurs, send an error response
        return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
        });
    }
}
