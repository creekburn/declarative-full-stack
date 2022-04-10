FROM public.ecr.aws/lambda/nodejs:14

# Copy Node Modules
COPY node_modules/ ${LAMBDA_TASK_ROOT}/node_modules
# Copy Root package.json file
COPY package.json ${LAMBDA_TASK_ROOT}/package.json
# Copy API directory into Execution directory.
COPY api/ ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]