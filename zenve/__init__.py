# Ensure compatibility with MySQL 8.0 on Django 6+
try:
    from django.db.backends.mysql.features import DatabaseFeatures
    DatabaseFeatures.minimum_database_version = property(lambda self: (8, 0))
except ImportError:
    pass

try:
    from django.db.backends.base.base import BaseDatabaseWrapper
    BaseDatabaseWrapper.check_database_version_supported = lambda self: None
except ImportError:
    pass
