from setuptools import find_packages
from setuptools import setup

with open(file="README.md", mode="r") as readme_handle:
    long_description = readme_handle.read()

setup(
    name='basket',
    version='0.0.1',
    description='Heramienta de Automatizacion de ALSW',
    long_description=long_description,
    author='ChepeCarlos',
    author_email='chepecarlos@alswblog.org',
    url='https://github.com/chepecarlos/Basket',
    install_requires=[],
    packages=find_packages(where='src', exclude=('tests*', 'testing*')),
    package_dir={"": "src"},
    entry_points={
        'console_scripts': [
            'basket-cli = basket.main:main'
        ]
    },
)
