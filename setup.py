from setuptools import find_packages, setup

with open("VERSION", "r") as f:
    version = f.read().strip()

with open(file="README.md", mode="r") as readme_handle:
    long_description = readme_handle.read()

with open("requirements.txt", "r") as f:
    required = f.read().splitlines()

setup(
    name="basket",
    version=version,
    description="Heramienta de Automatizacion de ALSW",
    long_description=long_description,
    author="ChepeCarlos",
    author_email="chepecarlos@alswblog.org",
    url="https://github.com/chepecarlos/Basket",
    install_requires=required,
    packages=find_packages(where="src", exclude=("tests*", "testing*")),
    package_dir={"": "src"},
    entry_points={"console_scripts": ["basket-cli = basket.main:main"]},
)
