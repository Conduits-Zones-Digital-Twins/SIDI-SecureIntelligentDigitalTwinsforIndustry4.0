import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import BaggingRegressor
from math import sqrt

def mean_absolute_percentage_error(y_true, y_pred):
    if len(y_true) != len(y_pred):
        raise Exception("mean_absolute_percentage_error, len is not the same")
    perc_sum = 0
    for index in range(len(y_true)):
        if y_true[index] != 0:
            perc_sum += (abs(y_true[index] - y_pred[index]) / y_true[index])
        else:
            perc_sum += (abs(y_true[index] - 0.1) / 0.1)
    return perc_sum / (len(y_true))

url = ("../data/simulation_1.csv")
data = pd.read_csv(url)
print(data.head())
print(data["latency"][0])
data["latency"].hist(bins=15)
plt.show()

# remove unused data
data.drop("content_encripted", axis=1, inplace=True)
data.drop("high_security", axis=1, inplace=True)
data.drop("destination", axis=1, inplace=True)
data.drop("l_1", axis=1, inplace=True)
data.drop("l_2", axis=1, inplace=True)

correlation_matrix = data.corr()
print(correlation_matrix["latency"])

X = data.drop("latency", axis=1)
X = X.values

y = data["latency"]
y = y.values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=12345
)

# ----------------- Grid search
print(" -----------------Grid search")

parameters = {
    "n_neighbors": range(1, 50),
    "weights": ["uniform", "distance"],
}
gridsearch = GridSearchCV(KNeighborsRegressor(), parameters)
gridsearch.fit(X_train, y_train)

print("Grid search best params", gridsearch.best_params_)
train_preds_grid = gridsearch.predict(X_train)
train_mse = mean_squared_error(y_train, train_preds_grid)
train_rmse = sqrt(train_mse)
train_mape = mean_absolute_percentage_error(y_train, train_preds_grid)
print("Error (rmse) training", train_rmse)
print("Error (mape) training", train_mape)


test_preds_grid = gridsearch.predict(X_test)
test_mse = mean_squared_error(y_test, test_preds_grid)
test_rmse = sqrt(test_mse)
test_mape = mean_absolute_percentage_error(y_test, test_preds_grid)
print("Error (rmse) testing", test_rmse)
print("Error (mape) testing", test_mape)

# ----------------- bagged_knn
print("----------------- bagged_knn")
best_k = gridsearch.best_params_["n_neighbors"]
best_weights = gridsearch.best_params_["weights"]
bagged_knn = KNeighborsRegressor(
    n_neighbors=best_k, weights=best_weights
)
bagging_model = BaggingRegressor(bagged_knn, n_estimators=100)
bagging_model.fit(X_train, y_train)
train_preds_grid = bagging_model.predict(X_train)
train_mse = mean_squared_error(y_train, train_preds_grid)
train_rmse = sqrt(train_mse)
train_mape = mean_absolute_percentage_error(y_train, train_preds_grid)
print("Error (rmse) training", train_rmse)
print("Error (mape) training", train_mape)

test_preds_bag = bagging_model.predict(X_test)
test_mse = mean_squared_error(y_test, test_preds_bag)
test_rmse = sqrt(test_mse)
test_mape = mean_absolute_percentage_error(y_test, test_preds_bag)
print("Error (rmse) testing", test_rmse)
print("Error (mape) testing", test_mape)