from shutil import rmtree

from setuptools import find_packages, setup

with open("VERSION", "r") as f:
    version = f.read().strip()

with open(file="README.md", mode="r") as readme_handle:
    long_description = readme_handle.read()

with open("requirements.txt", "r") as f:
    required = f.read().splitlines()

data_files = []
data_files.append(("", "data/pollo.txt"))

try:
    rmtree("build")
except:
    pass
try:
    rmtree("dist")
except:
    pass

setup(
    name="basket",
    version=version,
    python_requires=">=3",
    description="Heramienta de Automatizacion de ALSW",
    long_description=long_description,
    author="ChepeCarlos",
    author_email="chepecarlos@alswblog.org",
    url="https://github.com/chepecarlos/Basket",
    install_requires=required,
    packages=find_packages(where="src", exclude=("tests*", "testing*")),
    # data_files=data_files,D
    # data_files=["data", "data/pollo.txt"],
    include_package_data=True,
    package_dir={"": "src"},
    entry_points={"console_scripts": ["basket-cli = basket.main:main"]},
)
