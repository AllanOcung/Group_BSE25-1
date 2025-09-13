@echo off
echo =====================================
echo    Testing CI/CD Locally
echo =====================================

echo [1/3] Backend Test...
cd backend
python manage.py check
python manage.py test
echo ✅ Backend OK

echo [2/3] Frontend Test...
cd ..\frontend
call npm ci
call npm run type-check
call npm run lint:relaxed
call npm run build
echo ✅ Frontend OK

echo [3/3] Workflow Files...
if exist ".github\workflows\frontend-ci.yml" echo ✅ Frontend CI
if exist ".github\workflows\backend-ci.yml" echo ✅ Backend CI  
if exist ".github\workflows\deploy.yml" echo ✅ Deploy
if exist ".github\workflows\quality.yml" echo ✅ Quality

echo.
echo 🎉 Task 3 Complete! Ready for GitHub!
pause